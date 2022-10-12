var express = require("express");
var router = express.Router();
var models = require("../models");
var verifyToken = require('../middleware/verifyToken');

router.get("/",verifyToken, async (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);
  
  models.planesestudio
    .findAndCountAll({
      attributes: ["id_carrera", "id_materia"],
      /////////se agrega la asociacion 
      include: [{
          as: 'Carrera-Relacionado',
          model: models.carrera,
          attributes: ["id", "nombre"]
        },
        {
          as: 'Materia-Relacionado',
          model: models.materia,
          attributes: ["id", "nombre"]
        }
      ],
      ////////////////////////////////      
      order: [["id", "ASC"]],
      offset: (paginaActual-1) * cantidadAVer, 
      limit: cantidadAVer

    })
    .then(plan => res.send(plan))
    .catch(() => res.sendStatus(500));
});

router.post("/", verifyToken, async(req, res) => {
  models.planesestudio
    .create({ id_carrera: req.body.id_carrera, id_materia: req.body.id_materia })
    .then(plan => res.status(201).send({ id: plan.id }))
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
  models.planesestudio
    .findOne({
      attributes: ["id_carrera", "id_materia"],
      where: { id }
    })
    .then(plan => (plan ? onSuccess(plan) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", verifyToken, async(req, res) => {
  findCarrera(req.params.id, {
    onSuccess: plan => res.send(plan),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id",verifyToken, async (req, res) => {
  const onSuccess = carrera =>
    carrera
      .update({ id_materia: req.body.id_materia, id_carrera: req.body.id_carrera }, { fields: ["id_carrera", "id_materia"] })
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

router.delete("/:id", verifyToken, async(req, res) => {
  const onSuccess = plan =>
  plan
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
