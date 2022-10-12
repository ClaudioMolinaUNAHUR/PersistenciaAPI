var express = require("express");
var router = express.Router();
var models = require("../models");
var verifyToken = require('../middleware/verifyToken');

router.get("/", verifyToken, async  (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);
  models.materia
    .findAll({
      attributes: ["id", "nombre"],

      /////////se agrega la asociacion
      include:[{as:'Carrera-Relacionada',
                model:models.carrera,
                attributes: ["id","nombre"]}],

                ////////////////////////////////
                
                order: [["id", "ASC"]],
                offset: (paginaActual-1) * cantidadAVer, 
                limit: cantidadAVer
      
    })
    .then(materias => res.send(materias))
    .catch(() => res.sendStatus(500));
});



router.post("/", verifyToken, async (req, res) => {
  models.materia
    .create({ nombre: req.body.nombre  })
    .then(materias => res.status(201).send({ id: materias.id }))
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

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(materias => (materias ? onSuccess(materias) : onNotFound()))
    .catch(() => onError());
};


router.get("/:id",verifyToken, async  (req, res) => {
  findMateria(req.params.id, {
    onSuccess: materias => res.send(materias),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id",verifyToken, async  (req, res) => {
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
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", verifyToken, async (req, res) => {
  const onSuccess = materias =>
    materias
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});
router.get("/masConcurridas",verifyToken, async  (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);
  const { count } = models.materia
    .findAndCountAll({
      attributes: ["id", "nombre"],

      /////////se agrega la asociacion
      include:[{as:'Alumno-Relacionada',
                model:models.alumno,
                attributes: ["id","nombre", "apellido", "dni", "id_carrera"]},
                {as:'Planes-Relacionada',
                model:models.planesestudio,
                attributes: ["id_carrera","id_materia"]},
                {as:'Carrera-Relacionada',
                model:models.carrera,
                attributes: ["id","nombre"]}
              ],

      ////////////////////////////////
                
      order: [["nombre"]],
      offset: (paginaActual-1) * cantidadAVer, 
      limit: cantidadAVer
      
    })
    .then(materias => res.send(materias))
    .catch(() => res.sendStatus(500));
});
module.exports = router;
