'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class planesestudio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      this.hasMany(models.carrera// modelo al que pertenece
      ,{
        as : 'Carrera-Relacionado',  // nombre de mi relacion
        foreignKey: 'id_carrera',     // campo con el que voy a igualar
        // targetKey: 'id_carrera' 
      });
      this.hasMany(models.materia// modelo al que pertenece
      ,{
        as : 'Materia-Relacionado',  // nombre de mi relacion
        foreignKey: 'id_materia',     // campo con el que voy a igualar
        // targetKey: 'id_materia'
      });
    }
  }
  planesestudio.init({
    id_carrera: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'planesestudio',
  });
  return planesestudio;
};