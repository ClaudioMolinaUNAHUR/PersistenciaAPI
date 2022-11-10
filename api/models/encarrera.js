'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class enCarrera extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      this.belongsTo(models.alumno// modelo al que pertenece
      ,{
        as : 'Alumno-Relacionado',  // nombre de mi relacion
        foreignKey: 'dni_alumno',     // campo con el que voy a igualar
        // targetKey: 'id_carrera' 
      });
      this.belongsTo(models.carrera// modelo al que pertenece
      ,{
        as : 'Carrera-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_carrera',     // campo con el que voy a igualar
        // targetKey: 'id_materia'
      });
    }
  }
  enCarrera.init({
    dni_alumno: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'enCarrera',
  });
  return enCarrera;
};