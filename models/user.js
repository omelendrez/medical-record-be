'use strict'
const bcrypt = require('bcrypt')
const bcryptPromise = require('bcrypt-promise')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: { msg: 'Email no es un email válido' }
        },
        unique: {
          args: 'uniqueKey',
          msg: 'Email ya existe en la base de datos'
        }
      },
      companyId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
      password: DataTypes.STRING,
      statusId: DataTypes.TINYINT
    },
    {}
  )
  User.associate = function (models) {
    // associations can be defined here
  }
  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10)
      if (!salt) {
        throw new Error('Salt failed')
      }
      const hash = await bcrypt.hash(user.password, salt)
      if (!hash) {
        throw new Error('Hast failed')
      }
      user.password = hash
    }
  })

  User.prototype.comparePassword = async function (pw) {
    const pass = await bcryptPromise.compare(pw, this.password)
    if (!pass) {
      throw new Error('Usuario o Password incorrectos')
    } else {
      return this
    }
  }

  User.prototype.data = function () {
    const json = { ...this.toJSON(), password: undefined }
    return json
  }
  return User
}

// ALTER TABLE `vmr`.`users`
// ADD COLUMN `email` VARCHAR(255) NULL DEFAULT NULL AFTER `id`,
// CHANGE COLUMN `password` `password` VARCHAR(255) NULL DEFAULT NULL AFTER `email`;

// ALTER TABLE `vmr`.`users`
// DROP COLUMN `userId`,
// ADD COLUMN `companyId` INT NULL AFTER `name`,
// ADD COLUMN `roleId` TINYINT NULL AFTER `updatedAt`,
// CHANGE COLUMN `statusId` `statusId` TINYINT NULL ;
