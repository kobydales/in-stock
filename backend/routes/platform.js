const express = require('express')
const router = express.Router()
const platformModel = require('../models/platformModel')
const { requireAuth, requirePlatformOwner } = require('../middleware/auth')
const { sendServerError } = require('../utils/errors')

// Every route here is gated by requireAuth + requirePlatformOwner, so only
// the account matching PLATFORM_OWNER_EMAIL can ever reach these. Regular
// business admins get a 403, same as anyone else.
router.use(requireAuth, requirePlatformOwner)

router.get('/overview', async (req, res) => {
  try {
    const overview = await platformModel.getPlatformOverview()
    res.json(overview)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/businesses', async (req, res) => {
  try {
    const businesses = await platformModel.getAllBusinesses()
    res.json(businesses)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/businesses/:id', async (req, res) => {
  try {
    const detail = await platformModel.getBusinessDetail(req.params.id)
    if (!detail) return res.status(404).json({ error: 'Business not found' })
    res.json(detail)
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router
