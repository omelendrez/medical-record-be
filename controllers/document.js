const Document = require('../models').document
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints
const Op = Sequelize.Op
const sequelize = require('sequelize')
const {
  ReS,
  ReE,
  updateOrCreate,
  ACTIVE,
  DEFAULT_MAX_QUERY_LIMIT
} = require('../helpers')

const create = async (req, res) => {
  const { id } = req.params
  const { description } = req.body

  if (description.ext !== 0) {
    return ReE(
      res,
      {
        success: false,
        message:
          'El documento debe tener una extension (debe terminar con .pdf, .doc o .docx)'
      },
      422
    )
  }

  if (description.length === 0) {
    return ReE(
      res,
      {
        success: false,
        message: 'Es recomendable agregar una breve descripción del documento'
      },
      422
    )
  }

  await updateOrCreate(
    Document,
    {
      id: {
        [Op.eq]: id
      }
    },
    req.body
  )
    .then((record) => {
      const resp = {
        message: 'Datos guardados satisfactoriamente',
        record
      }
      return ReS(res, resp, 201)
    })
    .catch((err) => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {
  const User = require('../models').user
  Document.belongsTo(User)

  const Pet = require('../models').pet
  Document.belongsTo(Pet)

  const Customer = require('../models').customer
  Document.belongsTo(Customer)

  const filter = req.query.filter || ''
  const limit = parseInt(req.query.limit || DEFAULT_MAX_QUERY_LIMIT)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Document.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    where: {
      [Op.or]: [
        { description: { [Op.like]: `%${filter}%` } },
        sequelize.where(sequelize.literal('pet.name'), 'like', `%${filter}%`),
        sequelize.where(
          sequelize.literal('customer.name'),
          'like',
          `%${filter}%`
        )
      ],
      statusId: ACTIVE
    },
    offset,
    limit,
    attributes: [
      'id',
      'customerId',
      'petId',
      'ext',
      [sequelize.col('customer.name'), 'customerName'],
      [sequelize.col('pet.name'), 'petName'],
      'date',
      'description',
      [sequelize.col('user.name'), 'userName'],
      'updatedAt'
    ],
    order: [['date', 'DESC']],
    include: [
      {
        model: Pet,
        attributes: []
      },
      {
        model: Customer,
        attributes: []
      },
      {
        model: User,
        attributes: [],
        required: false
      }
    ]
  })
    .then((documents) => res.status(200).json({ success: true, documents }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getAll = getAll

const getById = (req, res) => {
  return Document.findOne({
    tableHint: TableHints.NOLOCK,
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'customerId',
      'petId',
      'ext',
      [sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), 'date'],
      'description'
    ]
  })
    .then((document) => res.status(200).json({ success: true, document }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getById = getById

const getByPet = (req, res) => {
  const User = require('../models').user
  Document.belongsTo(User)

  const limit = parseInt(req.query.limit || DEFAULT_MAX_QUERY_LIMIT)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Document.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    where: {
      statusId: ACTIVE,
      petId: req.params.id
    },
    offset,
    limit,
    attributes: [
      'id',
      'date',
      'customerId',
      'petId',
      'ext',
      'description',
      [sequelize.col('user.name'), 'userName'],
      'updatedAt'
    ],
    order: [['id', 'DESC']],
    include: {
      model: User,
      attributes: [],
      required: false
    }
  })
    .then((documents) => res.status(200).json({ success: true, documents }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getByPet = getByPet

const deleteRecord = (req, res) => {
  return Document.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((document) =>
      document
        .destroy()
        .then(() => {
          const resp = {
            message: `Documento eliminado`
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, 'Error ocurrido intentando eliminar el documento')
        )
    )
    .catch(() => ReE(res, 'Error ocurrido intentando eliminar el documento'))
}
module.exports.deleteRecord = deleteRecord
