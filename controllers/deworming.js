const Deworming = require("../models").deworming
const Sequelize = require("sequelize")
const TableHints = Sequelize.TableHints
const Op = Sequelize.Op
const sequelize = require("sequelize")
const {
  ReS,
  ReE,
  updateOrCreate,
  ACTIVE,
  INACTIVE,
  updateCustomerBalance,
} = require("../helpers")

const create = async (req, res) => {
  const { id, date, amount } = req.body

  if (!id) {
    if (amount.length === 0)
      return ReE(
        res,
        { success: false, message: "Los importes no pueden quedar vacíos" },
        422
      )
    if (isNaN(amount))
      return ReE(
        res,
        { success: false, message: "Los importes deben contener números" },
        422
      )
    if (!date)
      return ReE(
        res,
        {
          success: false,
          message:
            "Faltan datos. Complete los datos faltantes y vuelva a intentar",
        },
        422
      )
  }

  if (!req.body.nextAppointment) {
    delete req.body.nextAppointment
  }

  await updateOrCreate(
    Deworming,
    {
      id: {
        [Op.eq]: id,
      },
    },
    req.body
  )
    .then((record) => {
      updateCustomerBalance(record.customerId)

      const resp = {
        message: "Datos guardados satisfactoriamente",
        record,
      }
      return ReS(res, resp, 201)
    })
    .catch((err) => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {
  const Pet = require("../models").pet
  Deworming.belongsTo(Pet)

  const Customer = require("../models").customer
  Deworming.belongsTo(Customer)

  const User = require("../models").user
  Deworming.belongsTo(User)

  const filter = req.query.filter || ""
  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Deworming.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    where: {
      [Op.or]: [
        { deworming: { [Op.like]: `%${filter}%` } },
        sequelize.where(sequelize.literal("pet.name"), "like", `%${filter}%`),
        sequelize.where(
          sequelize.literal("customer.name"),
          "like",
          `%${filter}%`
        ),
      ],
      statusId: ACTIVE,
    },
    offset,
    limit,
    attributes: [
      "id",
      "customerId",
      "petId",
      [sequelize.col("customer.name"), "customerName"],
      [sequelize.col("pet.name"), "petName"],
      "date",
      "deworming",
      "nextAppointment",
      "amount",
      [sequelize.col("user.name"), "userName"],
      "updatedAt",
    ],
    order: [["date", "DESC"]],
    include: [
      {
        model: Pet,
        attributes: [],
      },
      {
        model: Customer,
        attributes: [],
      },
      {
        model: User,
        attributes: [],
        required: false,
      },
    ],
  })
    .then((dewormings) => res.status(200).json({ success: true, dewormings }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getAll = getAll

const getInactive = (req, res) => {
  const User = require("../models").user
  Deworming.belongsTo(User)

  const Pet = require("../models").pet
  Deworming.belongsTo(Pet)

  const Customer = require("../models").customer
  Deworming.belongsTo(Customer)

  const filter = req.query.filter || ""
  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Deworming.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    where: {
      [Op.or]: [
        { deworming: { [Op.like]: `%${filter}%` } },
        sequelize.where(sequelize.literal("pet.name"), "like", `%${filter}%`),
        sequelize.where(
          sequelize.literal("customer.name"),
          "like",
          `%${filter}%`
        ),
      ],
      statusId: INACTIVE,
    },
    offset,
    limit,
    attributes: [
      "id",
      "customerId",
      "petId",
      [sequelize.col("customer.name"), "customerName"],
      [sequelize.col("pet.name"), "petName"],
      "date",
      "deworming",
      "nextAppointment",
      "amount",
      [sequelize.col("user.name"), "userName"],
      "updatedAt",
    ],
    order: [["date", "DESC"]],
    include: [
      {
        model: Pet,
        attributes: [],
      },
      {
        model: Customer,
        attributes: [],
      },
      {
        model: User,
        attributes: [],
        required: false,
      },
    ],
  })
    .then((dewormings) => res.status(200).json({ success: true, dewormings }))
    .catch((err) => ReE(res, err, 422))
}

module.exports.getInactive = getInactive

const getById = (req, res) => {
  return Deworming.findOne({
    tableHint: TableHints.NOLOCK,
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "customerId",
      "petId",
      [sequelize.fn("date_format", sequelize.col("date"), "%Y-%m-%d"), "date"],
      "deworming",
      [
        sequelize.fn(
          "date_format",
          sequelize.col("nextAppointment"),
          "%Y-%m-%d"
        ),
        "nextAppointment",
      ],
      "amount",
    ],
  })
    .then((deworming) => res.status(200).json({ success: true, deworming }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getById = getById

const getByPet = (req, res) => {
  const User = require("../models").user
  Deworming.belongsTo(User)

  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Deworming.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    where: {
      statusId: ACTIVE,
      petId: req.params.id,
    },
    offset,
    limit,
    attributes: [
      "id",
      "date",
      "deworming",
      "nextAppointment",
      "amount",
      [sequelize.col("user.name"), "userName"],
      "updatedAt",
    ],
    order: [["date", "DESC"]],
    include: {
      model: User,
      attributes: [],
      required: false,
    },
  })
    .then((dewormings) => res.status(200).json({ success: true, dewormings }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getByPet = getByPet

const getnextAppointments = (req, res) => {
  const Pet = require("../models").pet
  Deworming.belongsTo(Pet)

  const Customer = require("../models").customer
  Deworming.belongsTo(Customer)

  return Deworming.findAndCountAll({
    where: [
      sequelize.where(
        sequelize.col("nextAppointment"),
        ">=",
        sequelize.literal("CURDATE()")
      ),
    ],
    attributes: [
      "id",
      [
        sequelize.fn(
          "date_format",
          sequelize.col("nextAppointment"),
          "%Y-%m-%d"
        ),
        "nextAppointment",
      ],
      [sequelize.col("pet.name"), "petName"],
      [sequelize.col("customer.name"), "customerName"],
      "customerId",
      "petId",
    ],
    order: [["nextAppointment", "ASC"]],
    include: [
      { model: Pet, attributes: [] },
      { model: Customer, attributes: [] },
    ],
  })
    .then((dewormings) => res.status(200).json({ success: true, dewormings }))
    .catch((err) => ReE(res, err, 422))
}

module.exports.getnextAppointments = getnextAppointments

const deleteRecord = (req, res) => {
  return Deworming.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((deworming) =>
      deworming
        .destroy()
        .then((deworming) => {
          const resp = {
            message: `Desparasitación eliminada`,
            deworming,
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, "Error ocurrido intentando eliminar la desparasitación")
        )
    )
    .catch(() =>
      ReE(res, "Error ocurrido intentando eliminar la desparasitación")
    )
}
module.exports.deleteRecord = deleteRecord

const deactivateRecord = (req, res) => {
  return Deworming.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((deworming) =>
      deworming
        .update({ statusId: INACTIVE })
        .then((deworming) => {
          const resp = {
            message: `Desparasitación desactivada`,
            deworming,
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, "Error ocurrido intentando eliminar la desparasitación")
        )
    )
    .catch(() =>
      ReE(res, "Error ocurrido intentando eliminar la desparasitación")
    )
}
module.exports.deactivateRecord = deactivateRecord

const restoreRecord = (req, res) => {
  return Deworming.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((deworming) =>
      deworming
        .update({ statusId: ACTIVE })
        .then((deworming) => {
          const resp = {
            message: `Desparasitación restaurada`,
            deworming,
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, "Error ocurrido intentando restaurar la desparasitación")
        )
    )
    .catch(() =>
      ReE(res, "Error ocurrido intentando restaurar la desparasitación")
    )
}
module.exports.restoreRecord = restoreRecord
