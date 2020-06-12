'use strict'
module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define('consultation', {
    customerId: DataTypes.INTEGER,
    petId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    anamnesis: DataTypes.STRING(500),
    clinicalExamination: DataTypes.STRING(500),
    diagnosis: DataTypes.STRING(500),
    treatment: DataTypes.STRING(500),
    treatmentStage: DataTypes.STRING,
    nextAppointment: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    statusId: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    },
    userId: DataTypes.INTEGER
  }, {})
  Consultation.associate = function (models) {
    // associations can be defined here
  }
  Consultation.prototype.data = function () {
    let json = this.toJSON()
    return json
  }
  return Consultation
}