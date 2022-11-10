'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class aula extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.materia// modelo al que pertenece
      ,{
        as : 'Materia-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_materia',  // foreignKey es el id destino "alumno"
      });
    }
  }
  aula.init({
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'aula',
  });
  return aula;
};