var express = require("express");
const verifyToken = require("../middleware/verifyToken");
var router = express.Router();
var models = require("../models");

router.get("/",verifyToken, async (req, res) => {

  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);

  console.log("Esto es un mensaje para ver en consola");
  models.alumno
    .findAll({
      attributes: [ "dni", "nombre", "apellido"],

      /////////se agrega la asociacion 
      include: [{
        as: 'Perfil-Relacionado',
        model: models.perfil,
        attributes: ["secundario", "colegio"]
      }],
      ////////////////////////////////

      order: [["id", "ASC"]],
      offset: (paginaActual-1) * cantidadAVer, 
      limit: cantidadAVer

    })
    .then(alumnos => res.send(alumnos)) //muestra alumno
    .catch(() => res.sendStatus(500));
});

router.post("/", verifyToken, async(req, res) => {
  req.body.id_perfil //TAREAS LLENAR PERFIL Y CARRERA
  models.alumno
    .create({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
      id_perfil: req.body.id_perfil
    })
    .then(alumno => res.status(201).send({ dni: alumno.dni }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

router.get("/:dni", verifyToken, async(req, res) => {
  findalumno(req.params.dni, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.get("/notas/:dni", verifyToken, async(req, res) => {
  const onSuccess = alumno => 
    obtenerNotas(alumno.dni, {
        onSuccess: planCarrera => res.send(planCarrera),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
        })
  findalumno(req.params.dni, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

const obtenerNotas = (dni_alumno, { onSuccess, onNotFound, onError }) => {
  models.nota
    .findAll({
      attributes: ["nota"],
      /////////se agrega la asociacion
      include:[ {as:'Materia-Relacionada',
                model:models.materia,
                attributes: ["id","nombre"]}
              ],
      where:  {dni_alumno}
    })
    .then(not=> (not ? onSuccess(not): onNotFound()))
    .catch(() => onError());
};

const findalumno = (dni, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["dni", "nombre", "apellido", "id_perfil"],
      where: { dni }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.put("/:dni",verifyToken, async (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        id_carrera: req.body.id_carrera
      },
        { fields: ["nombre", "apellido", "dni", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findalumno(req.params.dni, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:dni",verifyToken, async (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findalumno(req.params.dni, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
