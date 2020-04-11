const express = require('express')
const router = express.Router()

const Customer = require('../controllers/customer')
const Pet = require('../controllers/pet')
const Consultation = require('../controllers/consultation')
const Status = require('../controllers/status')

router.get('/api/customers', Customer.getAll)
router.get('/api/customers/:id', Customer.getById)
router.post('/api/customers', Customer.create)
router.delete('/api/customers/:id', Customer.deleteRecord)

router.get('/api/pets', Pet.getAll)
router.post('/api/pets', Pet.create)
router.delete('/api/pets/:id', Pet.deleteRecord)

router.get('/api/consultations', Consultation.getAll)
router.post('/api/consultations', Consultation.create)
router.delete('/api/consultations/:id', Consultation.deleteRecord)

router.get('/api/statuses', Status.getAll)
router.post('/api/statuses', Status.create)
router.delete('/api/statuses/:id', Status.deleteRecord)

module.exports = router
