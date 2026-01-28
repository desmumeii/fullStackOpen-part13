const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const {Op} = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.substring]: req.query.search }},
      { author: { [Op.substring]: req.query.search }}
    ]
  }

  const blogs = await Blog.findAll({
    where,
    order: [['likes', 'DESC']],
    include: {
      model: User,
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  })
  res.json(blogs)
})


router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.status(201).json(blog)
  } catch (error) {
    throw error
  }
  
})

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)

  if (!blog) {
    const error = new Error('blog not found')
    error.name = 'NotFoundError'
    throw error
  }

  req.blog = blog
  next()
}

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog.userId !== req.decodedToken.id) {
    const error = new Error('only the creator can delete a blog')
    error.name = 'ValidationError'
    throw error
  }

  await req.blog.destroy()
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.body.likes !== undefined && typeof req.body.likes !== 'number') {
    const error = new Error('likes must be a number')
    error.name = 'ValidationError'
    throw error
  }

  if (req.body.important !== undefined) {
    req.blog.important = req.body.important
  }

  if (req.body.likes !== undefined) {
    req.blog.likes = req.body.likes
  }

  await req.blog.save()
  res.json(req.blog)
})


module.exports = router