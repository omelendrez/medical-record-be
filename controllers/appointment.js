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

  let query = queries.appointments.rows
    .replace('{limit}', limit)
    .replace('{offset}', offset)
    .replace('{filter}', filter)
    .replace('{filter}', filter)
    .replace('{filter}', filter)

  const tableRows = await seq.query(query)


  query = queries.appointments.count
    .replace('{filter}', filter)
    .replace('{filter}', filter)
    .replace('{filter}', filter)


  const recordsCount = await seq.query(query)

  const total = recordsCount[0].reduce((acc, curr) => acc += curr.total, 0)

  res.status(200).json({ success: true, appointments: { rows: tableRows[0], count: total } })

}

module.exports.getAppointments = getAppointments
