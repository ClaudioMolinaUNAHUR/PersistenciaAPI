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
      this.hasMany(models.alumno// modelo al que pertenece
      ,{
        as : 'Alumno-Relacionado',  // nombre de mi relacion
        foreignKey: 'id',  // foreignKey es el id destino "alumno"
        targetKey: 'id_alumno'  // foreignKey es el id origen "nota"
      });
      this.hasMany(models.profesor// modelo al que pertenece
      ,{
        as : 'Profesor-Relacionado',  // nombre de mi relacion
        foreignKey: 'id',  // campo con el que voy a igualar
        targetKey: 'id_profesor'  
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