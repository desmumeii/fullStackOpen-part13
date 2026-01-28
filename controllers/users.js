const router = require('express').Router()

const { User, ReadingList } = require('../models')
const { Blog } = require('../models')
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    throw error
  }
})

router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    await user.update(req.body)
    res.json(user)
  } catch (error) {
    throw error
  }
})

router.get('/:id', async (req, res) => {
  const readFilter = req.query.read
  let throughWhere = {}

  if (readFilter === 'true') throughWhere.read = true
  if (readFilter === 'false') throughWhere.read = false

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      through: {
        attributes: ['id', 'read'],
        where: throughWhere
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  res.json(user)
})


module.exports = router