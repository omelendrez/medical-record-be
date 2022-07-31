'use strict'
const isValidEmail = require('../helpers').isValidEmail

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'customer',
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Nombre de cliente es un campo obligatorio' }
        }
      },
      address: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      phone: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: '',
        validate: {
          checkLength(value) {
            if (value.length && !isValidEmail(value)) {
              throw new Error('Email no es un email válido')
            }
          }
        }
      },
      observations: {
        type: DataTypes.STRING(500),
        defaultValue: ''
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      statusId: DataTypes.TINYINT,
      userId: DataTypes.INTEGER
    },
    {}
  )
  Customer.associate = function (models) {
    // associations can be defined here
  }
  Customer.prototype.data = function () {
    let json = this.toJSON()
    return json
  }
  return Customer
}
