'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alumno extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      this.hasMany(models.enCarrera// modelo al que pertenece
      ,{
        as : 'Alumno-conCarrera',  // nombre de mi relacion
        foreignKey: 'dni_alumno'     // campo con el que voy a igualar
      })
      this.hasMany(models.nota// modelo al que pertenece
      ,{
        as : 'Alumno-conNota',  // nombre de mi relacion
        foreignKey: 'dni_alumno'     // campo con el que voy a igualar
      })
      this.hasOne(models.user// modelo al que pertenece
      ,{
        as : 'Usuario-Relacionado',  // nombre de mi relacion
        foreignKey: 'dni_alumno'     // campo con el que voy a igualar
      })
      this.belongsTo(models.perfil// modelo al que pertenece
      ,{
        as : 'Perfil-Relacionado',  // nombre de mi relacion
        foreignKey: 'id_perfil'     // campo con el que voy a igualar
      })

    }
  } //inicializa modelo, para guardar en sequelze 
  alumno.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    dni: DataTypes.INTEGER,
    id_perfil: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'alumno',
  });
  return alumno;
};