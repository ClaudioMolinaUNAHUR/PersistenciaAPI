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
    static associate(models)  {
      // define association here
      this.belongsTo(models.alumno// modelo al que pertenece
      ,{
        as : 'Alumnos-Relacionado',  // nombre de mi relacion
        foreignKey: 'dni_alumno',  // foreignKey es el id destino "alumno"
        // targetKey: 'id_alumno'  // foreignKey es el id origen "nota"
      });
      this.belongsTo(models.materia// modelo al que pertenece
      ,{
        as : 'Materia-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_materia',  // campo con el que voy a igualar
        // targetKey: 'id_profesor'  
      });
    }
  }
  nota.init({
    nota: DataTypes.INTEGER,
    dni_alumno: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'nota',
  });
  return nota;
};