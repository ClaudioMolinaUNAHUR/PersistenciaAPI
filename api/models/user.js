const bcrypt = require('bcryptjs');
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    encriptPassword = async (password) => { //registrar usuario, 
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
   };
    validarPassword = function(password){  // Se usa en login
      return bcrypt.compare(password, this.password);
    }
  }
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  
  return user;
};