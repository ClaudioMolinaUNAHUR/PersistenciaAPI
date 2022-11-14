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

//ALUMNOS EN ESTE ID CARRERA
router.get("/alumnos/:id", verifyToken, async(req, res) => {    
  const onSuccess = carrera =>
    findEnCarrera(carrera.id, {
        onSuccess: enCarrera => res.send(enCarrera),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
        })
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

const findEnCarrera = (id_carrera, { onSuccess, onNotFound, onError }) => {
  models.enCarrera
    .findAll({
      attributes: [['id_carrera','Carrera'], "dni_alumno"],
      /////////se agrega la asociacion
      include:[{as:'Carrera-Relacionada',
                model:models.carrera,
                attributes: ["nombre"]}
              ],
      where:  {id_carrera}
    })
    .then(datos=> (datos ? onSuccess(datos): onNotFound()))
    .catch(() => onError());
};

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

const findPlan = (id_carrera, { onSuccess, onNotFound, onError }) => {
  models.planesestudio
    .findAll({
      attributes: [['id_carrera','Carrera']],
      /////////se agrega la asociacion
      include:[{as:'Carrera-Relacionada',
                model:models.carrera,
                attributes: ["nombre"]},
                {as:'Materia-Relacionada',
                model:models.materia,
                attributes: ["id","nombre","duracion"]}
              ],
      where:  {id_carrera}
    })
    .then(plan=> (plan ? onSuccess(plan): onNotFound()))
    .catch(() => onError());
};

//duracion de una carrera
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

const sumarDuracion = (id_carrera, { onSuccess, onNotFound, onError }) => {
  models.planesestudio
    .findAll({
      attributes: [[sequelize.fn('sum', sequelize.col('duracion')), 'total']], // SUM('duracion') AS 'total'
      /////////se agrega la asociacion
      include:[{as:'Materia-Relacionada',
                model:models.materia,
                attributes: ["duracion"]}],
      where:  {id_carrera}
    })
    .then(plan=> (plan ? onSuccess({total_meses: plan[0].get("total")}) : onNotFound()))
    .catch(() => onError());
};

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
    .then(carrera => res.status(201).send("Se Agrego Materia"))
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

router.post("/act_fechas/", verifyToken, async  (req, res) => {
  models.planesestudio
      .findAll({
        attributes: ["id","fecha_inicio","fecha_fin"],
        /////////se agrega la asociacion
        include:[{as:'Materia-Relacionada',
                  model:models.materia,
                  attributes: ["duracion"]}],
        where:{}
      })
      .then((datos)=>{
          datos.forEach(dato => {dato.fecha_inicio = (req.body.fecha_inicio); dato.fecha_fin=(req.body.fecha_inicio)})
          datos.forEach(dato =>             
            dato.fecha_fin = new Date(dato.fecha_fin).setMonth(
                                    (new Date(dato.fecha_inicio)).getMonth() + dato["Materia-Relacionada"].duracion ))
          return datos
      })
      .then((datos)=>{
         datos.forEach( async(dato) => {
          let id = dato.id
          await models.planesestudio.update({
            fecha_inicio: dato.fecha_inicio,
            fecha_fin: dato.fecha_fin
          },{ where: {id} })
        })
      })
      .then(() => res.send(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      })
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