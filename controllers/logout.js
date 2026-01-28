const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  const token = req.get('authorization').substring(7)
  
  await Session.destroy({
    where: {
      userId: req.decodedToken.id,
      token
    }
  })

  res.status(204).end()
})

module.exports = router
