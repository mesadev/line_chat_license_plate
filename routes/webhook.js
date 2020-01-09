const express = require('express')
const router = express.Router()
const line = require('../controllers/lineConteoller')
router.get('/', line.test)
router.post('/',line.webhook)
module.exports = router