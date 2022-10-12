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
      attributes: ["id", "nombre", "apellido", "dni", "id_carrera"],

      /////////se agrega la asociacion 
      include: [{
        as: 'Carrera-Relacionada',
        model: models.carrera,
        attributes: ["id", "nombre"]
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
  models.alumno
    .create({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
      id_carrera: req.body.id_carrera
    })
    .then(alumno => res.status(201).send({ id: alumno.id }))
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

const findalumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "nombre", "apellido", "dni", "id_carrera"],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", verifyToken, async(req, res) => {
  findalumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id",verifyToken, async (req, res) => {
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
  findalumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id",verifyToken, async (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findalumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
