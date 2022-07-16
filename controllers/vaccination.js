const Vaccination = require("../models").vaccination
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
    Vaccination,
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
  Vaccination.belongsTo(Pet)

  const Customer = require("../models").customer
  Vaccination.belongsTo(Customer)

  const User = require("../models").user
  Vaccination.belongsTo(User)

  const filter = req.query.filter || ""
  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Vaccination.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    where: {
      [Op.or]: [
        { vaccination: { [Op.like]: `%${filter}%` } },
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
      [sequelize.fn("date_format", sequelize.col("date"), "%Y-%m-%d"), "date"],
      "vaccination",
      [
        sequelize.fn(
          "date_format",
          sequelize.col("nextAppointment"),
          "%Y-%m-%d"
        ),
        "nextAppointment",
      ],
      "amount",
      [sequelize.col("user.name"), "userName"],
      [sequelize.col("vaccination.updatedAt"), "updatedAt"],
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
    .then((vaccinations) =>
      res.status(200).json({ success: true, vaccinations })
    )
    .catch((err) => ReE(res, err, 422))
}
module.exports.getAll = getAll

const getInactive = (req, res) => {
  const Pet = require("../models").pet
  Vaccination.belongsTo(Pet)

  const Customer = require("../models").customer
  Vaccination.belongsTo(Customer)

  const User = require("../models").user
  Vaccination.belongsTo(User)

  const filter = req.query.filter || ""
  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Vaccination.findAndCountAll({
    tableHint: TableHints.NOLOCK,
    where: {
      [Op.or]: [
        { vaccination: { [Op.like]: `%${filter}%` } },
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
      "vaccination",
      "nextAppointment",
      "amount",
      [sequelize.col("user.name"), "userName"],
      [sequelize.col("vaccination.updatedAt"), "updatedAt"],
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
    .then((vaccinations) =>
      res.status(200).json({ success: true, vaccinations })
    )
    .catch((err) => ReE(res, err, 422))
}

module.exports.getInactive = getInactive

const getById = (req, res) => {
  return Vaccination.findOne({
    tableHint: TableHints.NOLOCK,
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "customerId",
      "petId",
      [sequelize.fn("date_format", sequelize.col("date"), "%Y-%m-%d"), "date"],
      "vaccination",
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
    .then((vaccination) => res.status(200).json({ success: true, vaccination }))
    .catch((err) => ReE(res, err, 422))
}
module.exports.getById = getById

const getByPet = (req, res) => {
  const User = require("../models").user
  Vaccination.belongsTo(User)

  const limit = parseInt(req.query.limit || 10)
  const page = parseInt(req.query.page || 1)

  const offset = limit * (page - 1)

  return Vaccination.findAndCountAll({
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
      "vaccination",
      "nextAppointment",
      "amount",
      [sequelize.col("user.name"), "userName"],
    ],
    order: [["date", "DESC"]],
    include: {
      model: User,
      attributes: [],
      required: false,
    },
  })
    .then((vaccinations) =>
      res.status(200).json({ success: true, vaccinations })
    )
    .catch((err) => ReE(res, err, 422))
}
module.exports.getByPet = getByPet

const getnextAppointments = (req, res) => {
  const Pet = require("../models").pet
  Vaccination.belongsTo(Pet)

  const Customer = require("../models").customer
  Vaccination.belongsTo(Customer)

  return Vaccination.findAndCountAll({
    where: [
      sequelize.where(
        sequelize.col("nextAppointment"),
        ">=",
        //sequelize.literal("DATE_ADD(CURDATE(), INTERVAL -1 DAY)")
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
    .then((vaccinations) =>
      res.status(200).json({ success: true, vaccinations })
    )
    .catch((err) => ReE(res, err, 422))
}

module.exports.getnextAppointments = getnextAppointments

const deleteRecord = (req, res) => {
  return Vaccination.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((vaccination) =>
      vaccination
        .update({ statusId: INACTIVE })
        .then((vaccination) => {
          const resp = {
            message: `Vacunación eliminada`,
            vaccination,
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, "Error ocurrido intentando eliminar la vacunación")
        )
    )
    .catch(() => ReE(res, "Error ocurrido intentando eliminar la vacunación"))
}
module.exports.deleteRecord = deleteRecord

const deactivateRecord = (req, res) => {
  return Vaccination.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((vaccination) =>
      vaccination
        .update({ statusId: INACTIVE })
        .then((vaccination) => {
          const resp = {
            message: `Vacunación desactivada`,
            vaccination,
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, "Error ocurrido intentando eliminar la vacunación")
        )
    )
    .catch(() => ReE(res, "Error ocurrido intentando eliminar la vacunación"))
}
module.exports.deactivateRecord = deactivateRecord

const restoreRecord = (req, res) => {
  return Vaccination.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((vaccination) =>
      vaccination
        .update({ statusId: ACTIVE })
        .then((vaccination) => {
          const resp = {
            message: `Vacunación restaurada`,
            vaccination,
          }
          return ReS(res, resp, 200)
        })
        .catch(() =>
          ReE(res, "Error ocurrido intentando restaurar la vacunación")
        )
    )
    .catch(() => ReE(res, "Error ocurrido intentando restaurar la vacunación"))
}
module.exports.restoreRecord = restoreRecord
