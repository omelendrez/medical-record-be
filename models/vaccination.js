'use strict'
module.exports = (sequelize, DataTypes) => {
  const Vaccination = sequelize.define(
    'vaccination',
    {
      customerId: DataTypes.INTEGER,
      petId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      vaccination: DataTypes.STRING(500),
      nextAppointment: {
        type: DataTypes.DATE,
        defaultValue: null
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      statusId: DataTypes.TINYINT,
      userId: DataTypes.INTEGER
    },
    {}
  )
  Vaccination.associate = function (models) {
    // associations can be defined here
  }
  Vaccination.prototype.data = function () {
    let json = this.toJSON()
    return json
  }
  return Vaccination
}
