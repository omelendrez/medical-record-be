const User = require('../models').user
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints
const Op = Sequelize.Op
const sequelize = require("sequelize")
const { ReS, ReE, updateOrCreate } = require('../helpers')

const create = async (req, res) => {
  const { id, name, password } = req.body

  const user = await User.findOne({ where: { name } })

  if (user) {
    return ReE(res, { success: false, message: 'Ya existe un usuario con ese nombre' }, 422)
  }

  if (!name || (!password)) {
    return ReE(res, { success: false, message: 'Usuario y Password son campos obligatorios' }, 422)
  }

  await updateOrCreate(User,
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
      ReS(res, resp, 201)
    })
    .catch(err => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {

  return User
    .findAndCountAll({
      tableHint: TableHints.NOLOCK,
      attributes: [
        'name'
      ]
    })
    .then(users => res
      .status(200)
      .json({ success: true, users }))
    .catch(err => ReE(res, err, 422))
}
module.exports.getAll = getAll

const update = async (req, res) => {
  const { name, password } = req.body
  const { id } = res.params
  return User
    .findOne({ where: { id } })
    .then(user => {
      user.update({
        name, password
      })
        .then(user => {
          res
            .status(200)
            .json(user.data())
        })
        .catch(err => ReE(res, err, 401))
    })
}

module.exports.update = update

const login = async (req, res) => {
  const { name, password } = req.body
  if (!name || !password) {
    return ReE(res, 'Usuario y Password son campos obligatorios', 401)
  }
  return User
    .findOne({ where: { name } })
    .then(user => {
      if (!user) {
        return ReE(res, 'Usuario o Password incorrectos', 401)
      }
      user.comparePassword(password)
        .then(user => {
          res
            .status(200)
            .json(user.data())
        })
        .catch(err => ReE(res, err, 401))
    })
}

module.exports.login = login
