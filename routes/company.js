const express = require('express')
const router = express.Router()

const Company = require('../controllers/company')
router.post('/', Company.create)
router.post('/:id', Company.create)
router.get('/', Company.getAll)
router.get('/:id', Company.getById)
router.put('/:id', Company.create)

module.exports = router
