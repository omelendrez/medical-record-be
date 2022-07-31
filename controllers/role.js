const Role = require('../models').role
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints
const Op = Sequelize.Op
const { ReS, ReE, updateOrCreate } = require('../helpers')

module.exports.create = async (req, res) => {
  const { id } = req.params
  await updateOrCreate(
    Role,
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

const getAll = (req, res) => {
  return Role.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    attributes: ['id', 'name', 'observations']
  })
    .then((roles) => res.status(200).json({ success: true, roles }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getAll = getAll

module.exports.deleteRecord = (req, res) =>
  ReE(
    res,
    'La tabla de Roles es una tabla reservada y sus registros no pueden ser eliminados'
  )
