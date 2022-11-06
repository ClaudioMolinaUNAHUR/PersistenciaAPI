'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carrera extends Model {    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      this.hasMany(models.enCarrera// modelo al que pertenece
      ,{
        as : 'Carrera-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_carrera'     // campo con el que voy a igualar
      })
      this.hasMany(models.planesestudio// modelo al que pertenece
      ,{
        as : 'Plan-deCarrera',  // nombre de mi relacion
        foreignKey: 'id_carrera'     // campo con el que voy a igualar
      })

    }
  } //inicializa modelo, para guardar en sequelze 
  carrera.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'carrera',
  });
  return carrera;
};