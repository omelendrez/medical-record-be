const express = require('express')
const router = express.Router()

const Consultation = require('../controllers/consultation')

router.get('/', Consultation.getAll)
router.get('/inactive', Consultation.getInactive)
router.get('/programmed-visits', Consultation.getnextAppointments)
router.get('/by-pet/:id', Consultation.getByPet)
router.get(
  '/programmed-visits-by-period',
  Consultation.getnextAppointmentsByPeriod
)
router.get('/:id', Consultation.getById)
router.post('/', Consultation.create)
router.post('/:id', Consultation.create)
router.delete('/:id', Consultation.deleteRecord)
router.put('/:id', Consultation.deactivateRecord)
router.put('/:id/restore', Consultation.restoreRecord)

module.exports = router
