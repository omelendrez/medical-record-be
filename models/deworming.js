'use strict'
module.exports = (sequelize, DataTypes) => {
  const Deworming = sequelize.define(
    'deworming',
    {
      customerId: DataTypes.INTEGER,
      petId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      deworming: DataTypes.STRING(500),
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
  Deworming.associate = function (models) {
    // associations can be defined here
  }
  Deworming.prototype.data = function () {
    let json = this.toJSON()
    return json
  }
  return Deworming
}
