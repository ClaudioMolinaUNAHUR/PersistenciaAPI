'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class aulas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      self.belongsTo(models.materia// modelo al que pertenece
      ,{
        as : 'Materia-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_materia'     // campo con el que voy a igualar
      })
    }
  }
  aulas.init({
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'aulas',
  });
  return aulas;
};