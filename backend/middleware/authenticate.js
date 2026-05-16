const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

function authenticate(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'missing token' })
  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'malformed token' })

  jwt.verify(parts[1], JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'invalid token' })
    req.user = payload
    next()
  })
}

module.exports = authenticate
