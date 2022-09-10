const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]
const queries = require('../helpers/queries.json')
const { queryResultsLimit } = require('../helpers')

let seq
if (config.use_env_variable) {
  seq = new Sequelize(process.env[config.use_env_variable], config)
} else {
  seq = new Sequelize(config.database, config.username, config.password, config)
}

const getAppointments = async (req, res) => {
  const limit = parseInt(req.query.limit || queryResultsLimit)
  const page = parseInt(req.query.page || 1)
  const offset = limit * (page - 1)
  const filter = req.query.filter || ''

  const rows = await seq.query(queries.appointments.rows, { replacements: { filter, offset, limit } })
  const count = await seq.query(queries.appointments.count, { replacements: { filter } })

  res.status(200).json({ success: true, appointments: { rows, count } })

}

module.exports.getAppointments = getAppointments
