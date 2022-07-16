const Account = require('../models').account
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints
const Op = Sequelize.Op
const sequelize = require("sequelize")
const { ReS, ReE, updateOrCreate, updateCustomerBalance } = require('../helpers')

const create = async (req, res) => {
  const { id, date, credit } = req.body

  if (!date || (!credit)) {
    return ReE(res, { success: false, message: 'Faltan datos. Complete los datos faltantes y vuelva a intentar' }, 422)
  }

  await updateOrCreate(Account,
    {
      id: {
        [Op.eq]: id
      }
    },
    req.body
  )
    .then(record => {

      updateCustomerBalance(record.customerId)

      const resp = {
        message: 'Datos guardados satisfactoriamente',
        record
      }
      ReS(res, resp, 201)
    })
    .catch(err => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {

  return Account
    .findAndCountAll({
      where: {
        customerId: req.params.id
      },
      tableHint: TableHints.NOLOCK,
      attributes: [
        [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), 'date'],
        'credit',
        'debit'
      ]
    })
    .then(accounts => res
      .status(200)
      .json({ success: true, accounts }))
    .catch(err => ReE(res, err, 422))
}
module.exports.getAll = getAll
