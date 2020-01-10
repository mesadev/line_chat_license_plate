const express = require('express')
const router = express.Router()
const text = require('../controllers/textConteoller')
router.get('/', text.text)
router.get('/id', text.id)
module.exports = router