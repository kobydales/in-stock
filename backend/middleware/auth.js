const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication token is required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      userId: decoded.userId,
      businessId: decoded.businessId,
      role: decoded.role,
      platformOwner: decoded.platformOwner,
    }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired, please log in again' })
    }
    return res.status(401).json({ error: 'Invalid authentication token' })
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication token is required' })
  }
  if (req.user.role !== 'admin' && !req.user.platformOwner) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

function requirePlatformOwner(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication token is required' })
  }
  if (!req.user.platformOwner) {
    return res.status(403).json({ error: 'Platform owner access required' })
  }
  next()
}

module.exports = { requireAuth, requireAdmin, requirePlatformOwner }