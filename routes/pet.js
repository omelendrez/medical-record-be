const express = require('express')
const router = express.Router()

const Pet = require('../controllers/pet')

router.get('/', Pet.getAll)
router.get('/inactive', Pet.getInactive)
router.get('/:id', Pet.getById)
router.post('/', Pet.create)
router.post('/:id', Pet.create)
router.delete('/:id', Pet.deleteRecord)
router.put('/:id', Pet.deactivateRecord)
router.put('/:id/restore', Pet.restoreRecord)

module.exports = router
