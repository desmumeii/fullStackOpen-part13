const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { Session, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)
      
      // Check if session exists in database
      const session = await Session.findOne({
        where: {
          userId: req.decodedToken.id,
          token
        }
      })

      if (!session) {
        return res.status(401).json({ error: 'session expired or invalid' })
      }

      // Check if user is disabled
      const user = await User.findByPk(req.decodedToken.id)
      if (!user) {
        return res.status(401).json({ error: 'user not found' })
      }
      
      if (user.disabled) {
        return res.status(401).json({ error: 'account disabled, please contact admin' })
      }

    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(e => e.message)
    return res.status(400).json({ error: messages.join(', ') })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: error.message })
  }

  res.status(500).json({ error: 'internal server error' })
}

module.exports = { errorHandler,tokenExtractor }
