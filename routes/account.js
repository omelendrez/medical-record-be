const express = require('express')
const router = express.Router()

const Account = require('../controllers/account')

router.post('/', Account.create)
router.post('/:id', Account.create)
router.get('/:id', Account.getAll)

module.exports = router
