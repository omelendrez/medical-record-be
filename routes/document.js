const express = require('express')
const router = express.Router()

const Document = require('../controllers/document')

router.post('/', Document.create)
router.get('/', Document.getAll)
router.get('/by-pet/:id', Document.getByPet)
router.post('/:id', Document.create)
router.get('/:id', Document.getAll)
router.delete('/:id', Document.deleteRecord)

module.exports = router
