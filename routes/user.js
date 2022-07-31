const express = require('express')
const router = express.Router()

const User = require('../controllers/user')

router.post('/', User.create)
router.post('/login', User.login)
router.post('/:id', User.create)
router.get('/', User.getAll)

module.exports = router
