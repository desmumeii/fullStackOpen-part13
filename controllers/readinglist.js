const router = require('express').Router()
const { ReadingList } = require('../models')
const { Blog } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.body.blogId)

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const readingListEntry = await ReadingList.create({
      userId: user.id,
      blogId: blog.id,
      read: req.body.read || false
    })

    res.status(201).json(readingListEntry)
  } catch (error) {
    throw error
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id)

    if (!readingListEntry) {
      return res.status(404).json({ error: 'Reading list entry not found' })
    }

    if (readingListEntry.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    await readingListEntry.update({ read: req.body.read })

    res.json(readingListEntry)
  } catch (error) {
    throw error
  }
})

module.exports = router