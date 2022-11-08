var express = require("express");
var router = express.Router();
var models = require("../models");
var verifyToken = require('../middleware/verifyToken');
var sequelize = require('sequelize');

router.get("/", verifyToken, async  (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);
  
  models.carrera
    .findAndCountAll({
      attributes: ["id", "nombre"],
      order: [["id", "ASC"]],
      offset: (paginaActual-1) * cantidadAVer, 
      limit: cantidadAVer

    })
    .then(carreras => res.send(carreras))
    .catch(() => res.sendStatus(500));
});

router.get("/:id", verifyToken, async(req, res) => {    
    const onSuccess = carrera =>
      findPlan(carrera.id, {
          onSuccess: planCarrera => res.send(planCarrera),
          onNotFound: () => res.sendStatus(404),
          onError: () => res.sendStatus(500)
          })
    findCarrera(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
});
router.get("/duracionTotal/:id", verifyToken, async(req, res) => {    
  const onSuccess = carrera =>
    sumarDuracion(carrera.id, {
        onSuccess: planCarrera => res.send(planCarrera),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
        })
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.post("/", verifyToken, async (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre })
    .then(carrera => res.status(201).send({ id: carrera.id }))
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

router.post("/add/:id", verifyToken, async (req, res) => {
  const id_materia = await req.body.id_materia
  models.planesestudio
    .create({ id_carrera: req.params.id, id_materia })
    .then(carrera => res.status(201).send({ id: carrera.id }))
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
  models.carrera
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

const findPlan = (id_carrera, { onSuccess, onNotFound, onError }) => {
  models.planesestudio
    .findAll({
      attributes: [['id_carrera','Carrera']],
      /////////se agrega la asociacion
      include:[{as:'Carrera-Relacionado',
                model:models.carrera,
                attributes: ["nombre"]},
                {as:'MateriaRelacionado',
                model:models.materia,
                attributes: ["id","nombre","duracion"]}
              ],
      where:  {id_carrera}
    })
    .then(plan=> (plan ? onSuccess(plan): onNotFound()))
    .catch(() => onError());
};
const sumarDuracion = (id_carrera, { onSuccess, onNotFound, onError }) => {
  models.planesestudio
    .findAll({
      attributes: [[sequelize.fn('sum', sequelize.col('duracion')), 'total']],
      /////////se agrega la asociacion
      include:[{as:'Materia-Relacionado',
                model:models.materia,
                attributes: ["duracion"]}],
      where:  {id_carrera}
    })
    .then(plan=> (plan ? onSuccess(plan): onNotFound()))
    .catch(() => onError());
};


router.put("/:id", verifyToken, async  (req, res) => {
  const onSuccess = carrera =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
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

router.delete("/:id",verifyToken, async  (req, res) => {
  const onSuccess = carrera =>
    carrera
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