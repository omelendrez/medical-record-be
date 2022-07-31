const express = require('express')
const router = express.Router()

const Status = require('../controllers/status')

router.get('/', Status.getAll)
router.post('/', Status.create)
router.post('/:id', Status.create)

module.exports = router
