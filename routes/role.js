const express = require('express')
const router = express.Router()

const Role = require('../controllers/role')
router.post('/', Role.create)
router.post('/:id', Role.create)
router.get('/', Role.getAll)
router.delete('/:id', Role.deleteRecord)

module.exports = router
