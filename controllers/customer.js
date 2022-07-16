const Customer = require('../models').customer
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints
const Op = Sequelize.Op
const sequelize = require("sequelize")
const { ReS, ReE, updateOrCreate, ACTIVE, INACTIVE } = require('../helpers')

const create = async (req, res) => {
  const { id, name, phone } = req.body

  if (!name || !phone) {
    return ReE(res, { success: false, message: 'Faltan datos. Complete los datos faltantes y vuelva a intentar' }, 422)
  }
  /*
  if (!id) {
    const found = await Customer.findOne({ where: { name } })
    if (found) {
      return ReE(res, { success: false, message: 'Ese nombre de cliente ya existe en la base de datos' }, 422)
    }
  }
  */
  await updateOrCreate(Customer,
    {
      id: {
        [Op.eq]: id
      }
    },
    req.body
  )
    .then(record => {
      const resp = {
        message: 'Datos guardados satisfactoriamente',
        record
      }
      return ReS(res, resp, 201)
    })
    .catch(err => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {
  const User = require("../models").user
  Customer.belongsTo(User)

  const Pet = require("../models").pet
  Customer.hasMany(Pet)

  const filter = req.query.filter || ''
  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)
  return Customer
    .findAndCountAll({
      tableHint: TableHints.NOLOCK,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${filter}%` } },
          { address: { [Op.like]: `%${filter}%` } },
          { phone: { [Op.like]: `%${filter}%` } }
        ],
        statusId: ACTIVE
      },
      distinct: true,
      offset,
      limit,
      order: [['id', 'DESC']],
      attributes: [
        'id',
        'name',
        'address',
        'phone',
        'email',
        'observations',
        'balance',
        'updatedAt'
      ],
      include: [{
        model: Pet,
        attributes: [
          'id', 'name', 'statusId'
        ],
        required: false
      }, {
        model: User,
        attributes: ['name'],
        required: false
      }]
    })
    .then(customers => res
      .status(200)
      .json({ success: true, customers }))
    .catch(err => ReE(res, err, 422))
}
module.exports.getAll = getAll

const getInactive = (req, res) => {
  const User = require('../models').user
  Customer.belongsTo(User)

  const filter = req.query.filter || ''
  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Customer
    .findAndCountAll({
      tableHint: TableHints.NOLOCK,
      where: {
        name: {
          [Op.like]: `%${filter}%`
        },
        statusId: INACTIVE
      },
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
      attributes: [
        'id',
        'name',
        'address',
        'phone',
        'email',
        'observations',
        [sequelize.col('user.name'), 'userName'],
        'updatedAt'
      ],
      include: {
        model: User,
        attributes: [],
        required: false
      }
    })
    .then(customers => res
      .status(200)
      .json({ success: true, customers }))
    .catch(err => ReE(res, err, 422))
}
module.exports.getInactive = getInactive

const getDebtors = (req, res) => {

  const Pet = require('../models').pet
  const Status = require('../models').status

  Customer.hasMany(Pet)
  Customer.belongsTo(Status)
  Status.hasMany(Customer)

  const filter = req.query.filter || ''
  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Customer
    .findAndCountAll({
      tableHint: TableHints.NOLOCK,
      where: [
        sequelize.where(sequelize.col('balance'), '<>', 0),
        {
          name: {
            [Op.like]: `%${filter}%`
          }
        }
      ],
      attributes: [
        'id',
        'name',
        'address',
        'phone',
        'email',
        'observations',
        [sequelize.col('status.name'), 'customerStatus'],
        'balance'
      ],
      order: [['name', 'ASC']],
      offset,
      limit,
      include: [
        {
          model: Status,
          attributes: [],
          required: true
        },
        {
          model: Pet,
          attributes: ['id', 'name', 'statusId'],
          required: false
        }]
    })
    .then(debtors => res
      .status(200)
      .json({ success: true, debtors }))
    .catch(err => ReE(res, err, 422))
}
module.exports.getDebtors = getDebtors

const getBalanceById = (req, res) => {

  return Customer
    .findOne({
      tableHint: TableHints.NOLOCK,
      where: {
        id: req.params.id
      },
      attributes: ['id', 'name', 'balance']
    })
    .then(debt => {
      res
        .status(200)
        .json({ success: true, debt })
    })
}

module.exports.getBalanceById = getBalanceById

const getById = (req, res) => {
  const Pet = require("../models").pet
  Customer.hasMany(Pet)

  return Customer
    .findOne({
      tableHint: TableHints.NOLOCK,
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'name',
        'address',
        'phone',
        'email',
        'observations',
        'statusId'
      ],
      include: [{
        model: Pet,
        attributes: [
          'id', 'name', 'statusId'
        ],
        required: false
      }]
    })
    .then(customer => res
      .status(200)
      .json({ success: true, customer }))
    .catch(err => ReE(res, err, 422))
}
module.exports.getById = getById

const deleteRecord = (req, res) => {
  const Pet = require('../models').pet
  return Customer
    .findOne({
      where: {
        id: req.params.id
      }
    })
    .then(customer =>
      customer.destroy()
        .then(customer => {
          Pet
            .findAll({ where: { customerId: req.params.id } })
            .then(pets => pets.map(pet => pet.update({ statusId: INACTIVE })))
          const resp = {
            message: `Cliente "${customer.name}" eliminado`,
            customer
          }
          return ReS(res, resp, 200)
        })
        .catch(() => ReE(res, 'Error ocurrido intentando eliminar el cliente'))
    )
    .catch(() => ReE(res, 'Error ocurrido intentando eliminar el cliente'))
}
module.exports.deleteRecord = deleteRecord

const deactivateRecord = (req, res) => {
  const Pet = require('../models').pet
  return Customer
    .findOne({
      where: {
        id: req.params.id
      }
    })
    .then(customer =>
      //      customer.destroy()
      customer.update({ statusId: INACTIVE })
        .then(customer => {
          Pet
            .findAll({ where: { customerId: req.params.id } })
            .then(pets => pets.map(pet => pet.update({ statusId: INACTIVE })))
          const resp = {
            message: `Cliente "${customer.name}" desactivado`,
            customer
          }
          return ReS(res, resp, 200)
        })
        .catch(() => ReE(res, 'Error ocurrido intentando eliminar el cliente'))
    )
    .catch(() => ReE(res, 'Error ocurrido intentando eliminar el cliente'))
}
module.exports.deactivateRecord = deactivateRecord

const restoreRecord = (req, res) => {
  const Pet = require('../models').pet
  return Customer
    .findOne({
      where: {
        id: req.params.id
      }
    })
    .then(customer =>
      //      customer.destroy()
      customer.update({ statusId: ACTIVE })
        .then(customer => {
          Pet
            .findAll({ where: { customerId: req.params.id } })
            .then(pets => pets.map(pet => pet.update({ statusId: ACTIVE })))
          const resp = {
            message: `Cliente "${customer.name}" restaurado`,
            customer
          }
          return ReS(res, resp, 200)
        })
        .catch(() => ReE(res, 'Error ocurrido intentando restaurar el cliente'))
    )
    .catch(() => ReE(res, 'Error ocurrido intentando restaurar el cliente'))
}
module.exports.restoreRecord = restoreRecord
