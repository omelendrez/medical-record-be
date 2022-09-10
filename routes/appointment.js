const express = require('express')
const router = express.Router()

const Appointment = require('../controllers/appointment')

router.get('/', Appointment.getAppointments)

module.exports = router
