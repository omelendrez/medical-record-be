const Company = require('../models').company
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints
const Op = Sequelize.Op
const { ReS, ReE, updateOrCreate } = require('../helpers')

const create = async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!name && !id) {
    return ReE(
      res,
      {
        success: false,
        message:
          'Faltan datos. Complete los datos faltantes y vuelva a intentar'
      },
      422
    )
  }

  await updateOrCreate(
    Company,
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
      ReS(res, resp, 201)
    })
    .catch((err) => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {
  return Company.findAndCountAll({
    tableHint: TableHints.NOLOCK
  })
    .then((companies) => res.status(200).json({ success: true, companies }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getAll = getAll

const getById = (req, res) => {
  const { id } = req.params
  return Company.findOne({
    tableHint: TableHints.NOLOCK,
    where: {
      id
    }
  })
    .then((company) => res.status(200).json({ success: true, company }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getById = getById

const deactivateRecord = (req, res) => {
  const { id } = req.params
  return Company.findOne({
    where: {
      id
    }
  })
    .then((company) =>
      //company.destroy()
      company
        .update({ statusId: INACTIVE })
        .then((company) => {
          const resp = {
            message: `Veterinaria "${company.name}" desactivada`,
            company
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, 'Error ocurrido intentando desactivar  veterinaria')
        )
    )
    .catch(() => ReE(res, 'Error ocurrido intentando desactivar  veterinaria'))
}
module.exports.deactivateRecord = deactivateRecord
