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
    static associate(models) {
      // define association here
      this.belongsTo(models.alumno// modelo al que pertenece
      ,{
        as : 'Alumno-Relacionado',  // nombre de mi relacion
        foreignKey: 'dni_alumno'     // campo con el que voy a igualar
      })

    }
  }
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    dni_alumno: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};