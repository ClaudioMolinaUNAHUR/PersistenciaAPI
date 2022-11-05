'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class materia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      this.hasOne(models.aula// modelo al que pertenece
      ,{
        as : 'Materia-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_materia'     // campo con el que voy a igualar
      })
      this.belongsTo(models.planesestudio// modelo al que pertenece
      ,{
        as : 'Materia_delPlan',  // nombre de mi relacion
        foreignKey: 'id_materia'     // campo con el que voy a igualar
      })
    }
  }
  materia.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'materia',
  });
  return materia;
};