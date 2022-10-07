'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nota extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      nota.hasMany(models.alumno// modelo al que pertenece
      ,{
        as : 'Alumno-Relacionado',  // nombre de mi relacion
        foreignKey: 'id_alumno'     // campo con el que voy a igualar
      });
      nota.hasMany(models.profesor// modelo al que pertenece
      ,{
        as : 'Profesor-Relacionado',  // nombre de mi relacion
        foreignKey: 'id_profesor'     // campo con el que voy a igualar
      });
    }
  }
  nota.init({
    nota: DataTypes.INTEGER,
    id_alumno: DataTypes.INTEGER,
    id_profesor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'nota',
  });
  return nota;
};