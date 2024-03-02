const express = require('express')
const router = express.Router()

const Customer = require('../controllers/customer')

router.get('/', Customer.getAll)
router.get('/inactive', Customer.getInactive)
router.get('/debtors', Customer.getDebtors)
router.get('/debtors/total-amount', Customer.getTotalAmount)
router.get('/debtors/:id', Customer.getBalanceById)
router.get('/:id', Customer.getById)
router.post('/', Customer.create)
router.post('/:id', Customer.create)
router.delete('/:id', Customer.deleteRecord)
router.put('/:id', Customer.deactivateRecord)
router.put('/:id/restore', Customer.restoreRecord)

module.exports = router
