const express = require('express')
const router = express.Router()

const Vaccination = require('../controllers/vaccination')

router.get('/', Vaccination.getAll)
router.get('/inactive', Vaccination.getInactive)
router.get('/programmed-visits', Vaccination.getnextAppointments)
router.get('/by-pet/:id', Vaccination.getByPet)
router.get(
  '/programmed-visits-by-period',
  Vaccination.getnextAppointmentsByPeriod
)
router.get('/:id', Vaccination.getById)
router.post('/', Vaccination.create)
router.post('/:id', Vaccination.create)
router.delete('/:id', Vaccination.deleteRecord)
router.put('/:id', Vaccination.deactivateRecord)
router.put('/:id/restore', Vaccination.restoreRecord)

module.exports = router
