const bcrypt = require('bcryptjs');
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {}
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  // user.prototype.encriptPassword = async (password) => {
  //   const salt = await bcrypt.genSalt(10);
  //   return bcrypt.hash(password, salt)
  // };
  return user;
};