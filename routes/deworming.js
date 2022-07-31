const express = require('express')
const router = express.Router()

const Deworming = require('../controllers/deworming')

router.get('/', Deworming.getAll)
router.get('/inactive', Deworming.getInactive)
router.get('/programmed-visits', Deworming.getnextAppointments)
router.get('/by-pet/:id', Deworming.getByPet)
router.get(
  '/programmed-visits-by-period',
  Deworming.getnextAppointmentsByPeriod
)
router.get('/:id', Deworming.getById)
router.post('/', Deworming.create)
router.post('/:id', Deworming.create)
router.delete('/:id', Deworming.deleteRecord)
router.put('/:id', Deworming.deactivateRecord)
router.put('/:id/restore', Deworming.restoreRecord)

module.exports = router
