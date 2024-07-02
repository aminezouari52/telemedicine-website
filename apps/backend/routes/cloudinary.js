const express = require('express')
const router = express.Router()

// MIDDLEWARES
const { authCheck, adminCheck } = require('../middlewares/auth')

// CONTROLLERS
const { upload, remove } = require('../controllers/cloudinary')

router.post('/uploadimages', authCheck, adminCheck, upload)
router.post('/removeimage', authCheck, adminCheck, remove)

module.exports = router
