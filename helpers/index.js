module.exports.updateOrCreate = (model, where, newItem, beforeCreate) => {
  return new Promise((resolve, reject) => {
    model
      .findOne({ where })
      .then(item => {
        if (!item) {
          return model.create(newItem)
            .then(item => resolve(item.data()))
            .catch(err => reject(err))
        }
        return item.update(newItem, { where: where })
          .then(item => resolve(item.data()))
          .catch(err => reject(err))
      })
  })
}

module.exports.ReE = (res, err, code) => {
  if (typeof err === 'object' && typeof err.message) {
    err = err.message
  }
  if (typeof code !== 'undefined') res.statusCode = code
  return res.json({ success: false, error: err })
}

module.exports.ReS = (res, data, code) => {
  let send_data = { success: true }
  if (typeof data === 'object') {
    send_data = Object.assign(data, send_data) // merge the objects
  }
  if (typeof code !== 'undefined') res.statusCode = code
  return res.json(send_data)
}

module.exports.verifyDelete = (models, where) => {
  return new Promise((resolve, reject) => {
    const promises = []
    models.map(model => {
      const Model = require('../models')[model]
      promises.push(Model.findAll({ where, raw: true }))
    })
    Promise
      .all(promises)
      .then(results => {
        resolve(results.filter(result => result.length > 0).length)
      })
  })
}

module.exports.ACTIVE = 1
module.exports.INACTIVE = 11

module.exports.updateCustomerBalance = async customerId => {
  const sequelize = require('sequelize')
  const Consultation = require('../models').consultation
  const Vaccination = require('../models').vaccination
  const Deworming = require('../models').deworming
  const Account = require('../models').account
  const Customer = require('../models').customer

  const params = {
    where: {
      customerId
    },
    attributes:
      [[sequelize.fn('sum', sequelize.col('amount')), 'total']]
  }

  let total = 0

  let res = await Consultation.findAll(params)
  total += res[0].toJSON().total

  res = await Vaccination.findAll(params)
  total += res[0].toJSON().total

  res = await Deworming.findAll(params)
  total += res[0].toJSON().total

  res = await Account
    .findAll({
      tableHint: sequelize.TableHints.NOLOCK,
      where: {
        customerId
      },
      attributes: [
        [sequelize.fn('sum', sequelize.literal('debit-credit')), 'total']
      ]
    })

  total += res[0].toJSON().total

  Customer
    .findOne({
      tableHint: sequelize.TableHints.NOLOCK,
      where: {
        id: customerId
      }
    })
    .then(customer => {
      customer.update({ balance: total })
    })
}

module.exports.queryResultsLimit = 10
