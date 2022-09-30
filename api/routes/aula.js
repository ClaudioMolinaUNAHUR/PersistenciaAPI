var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const cantidadAVisualizar = parseInt(req.query.cantidadAVisualizar);
  const paginaActual = parseInt(req.query.paginaActual);
  models.aulas
    .findAll({
      attributes: ["id", "id_materia"],

      /////////se agrega la asociacion 
      include:[{as:'Materia-Relacionada',
                model:models.materia,
                attributes: ["id","id_materia"]}],
                order: [["id", "ASC"]],
                offset: (paginaActual-1) * cantidadAVisualizar, 
                limit: cantidadAVisualizar
      ////////////////////////////////
    })
    .then(aulas => res.send(aulas))
    .catch(() => res.sendStatus(500));
});
router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.carrera
    .findAll({
      attributes: ["id", "nombre"]
    })
    .then(carreras => res.send(carreras))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.aulas
    .create({ id_materia: req.body.id_materia })
    .then(aula => res.status(201).send({ id: aula.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra aula con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findaula = (id, { onSuccess, onNotFound, onError }) => {
  models.aulas
    .findOne({
      attributes: ["id", "id_materia"],
      where: { id }
    })
    .then(aula => (aula ? onSuccess(aula) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findaula(req.params.id, {
    onSuccess: aula => res.send(aula),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = aula =>
    aulas
      .update({ id_materia: req.body.id_materia }, { fields: ["id_materia"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra aula con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findaula(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = aula =>
    aula
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findaula(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
