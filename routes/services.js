const express = require('express')
const router = express.Router()
const text = require('../controllers/textConteoller')
router.get('/', text.text)
module.exports = router