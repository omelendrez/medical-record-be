const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const pe = require('parse-error')
const cors = require('cors')
require('dotenv').config()

const role = require('./routes/role')
const company = require('./routes/company')
const customer = require('./routes/customer')
const pet = require('./routes/pet')
const consultation = require('./routes/consultation')
const vaccination = require('./routes/vaccination')
const deworming = require('./routes/deworming')
const account = require('./routes/account')
const status = require('./routes/status')
const user = require('./routes/user')
const appointment = require('./routes/appointment')
const document = require('./routes/document')

const models = require('./models')
const CONFIG = require('./config/config.json')

const app = express()

app.use(
  logger('dev', {
    skip: () => process.env.NODE_ENV === 'production'
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

models.sequelize
  .authenticate()
  .then(() => console.log('Connected to SQL database.'))
  .catch((err) => console.error('Unable to connect to SQL database.', err))

if (CONFIG.app === 'dev') {
  models.sequelize.sync({
    force: false,
    alter: true
  })
}

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.use('/api/roles', role)
app.use('/api/companies', company)
app.use('/api/customers', customer)
app.use('/api/pets', pet)
app.use('/api/consultations', consultation)
app.use('/api/vaccinations', vaccination)
app.use('/api/dewormings', deworming)
app.use('/api/accounts', account)
app.use('/api/status', status)
app.use('/api/users', user)
app.use('/api/appointments', appointment)
app.use('/api/documents', document)

app.use('/', function (req, res) {
  res.statusCode = 422
  res.json({ success: false, error: 'Endpoint not found', data: {} })
})

app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: err
  })
})

module.exports = app

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Uncaught Error', pe(error))
})
