'use strict'
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'role',
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Nombre del rol es un campo obligatorio' }
        }
      },
      observations: {
        type: DataTypes.STRING(500),
        defaultValue: ''
      },
      statusId: DataTypes.TINYINT
    },
    {}
  )
  Role.associate = function (models) {
    // associations can be defined here
  }
  Role.prototype.data = function () {
    let json = this.toJSON()
    return json
  }
  return Role
}
