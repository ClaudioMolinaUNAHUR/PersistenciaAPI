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
      this.belongsTo(models.carrera// modelo al que pertenece
      ,{
        as : 'Carrera-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_carrera',     // campo con el que voy a igualar
        // targetKey: 'id_carrera' 
      });
      this.belongsTo(models.materia// modelo al que pertenece
      ,{
        as : 'Materia-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_materia',     // campo con el que voy a igualar
        // targetKey: 'id_materia'
      });
    }
  }
  planesestudio.init({
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE,
    id_carrera: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'planesestudio',
  });
  return planesestudio;
};