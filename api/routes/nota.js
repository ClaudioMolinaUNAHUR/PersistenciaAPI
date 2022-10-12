var express = require("express");
var router = express.Router();
var models = require("../models");
var verifyToken = require('../middleware/verifyToken');

router.get("/",verifyToken, async (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);
  
  models.nota
    .findAndCountAll({
      attributes: ["id", "nota", "id_alumno","id_profesor"],

      /////////se agrega la asociacion 
      include: [{
          as: 'Alumno-Relacionado',
          model: models.alumno,
          attributes: ["id", "nombre", "apellido", "dni", "id_carrera"]
        },
        {
          as: 'Profesor-Relacionado',
          model: models.profesor,
          attributes: ["id", "nombre", "apellido", "dni", "id_materia"]
        }
      ],
      ////////////////////////////////

      order: [["id", "ASC"]],
      offset: (paginaActual-1) * cantidadAVer, 
      limit: cantidadAVer

    })
    .then(notas => res.send(notas))
    .catch(() => res.sendStatus(500));
});

router.post("/",verifyToken, async (req, res) => {
  models.nota
    .create({ nota: req.body.nota,
              id_alumno: req.body.id_alumno,
              id_profesor: req.body.id_profesor })
    .then(nota => res.status(201).send({ id: nota.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.nota
    .findOne({
      attributes: ["id", "nota", "id_alumno","id_profesor"],
      where: { id }
    })
    .then(nota => (nota ? onSuccess(nota) : onNotFound()))
    .catch(() => onError());
};


router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.nota
    .findAll({
      attributes: ["id", "nota", "id_alumno","id_profesor"]
    })
    .then(carreras => res.send(carreras))
    .catch(() => res.sendStatus(500));
});




router.get("/:id", verifyToken, async(req, res) => {
  findCarrera(req.params.id, {
    onSuccess: nota => res.send(nota),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", verifyToken, async(req, res) => {
  const onSuccess = nota =>
    nota
      .update({ nota: req.body.nota,
                id_alumno: req.body.id_alumno,
                id_profesor: req.body.id_profesor }, { fields: ["nota","id_alumno","id_profesor"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id",verifyToken, async (req, res) => {
  const onSuccess = nota =>
  nota
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
