'use strict'
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    'document',
    {
      customerId: DataTypes.INTEGER,
      petId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      ext: DataTypes.STRING,
      description: DataTypes.STRING(500),
      statusId: DataTypes.TINYINT,
      userId: DataTypes.INTEGER
    },
    {}
  )
  Document.associate = function (models) {
    // associations can be defined here
  }
  Document.prototype.data = function () {
    let json = this.toJSON()
    return json
  }
  return Document
}
