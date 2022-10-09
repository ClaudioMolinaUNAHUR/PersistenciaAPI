var express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const models = require('../models');
const { cls } = require("sequelize");
const verifyToken = require('../middleware/verifyToken');



dotenv.config();

router.post("/register", (req, res) => {
    // recuperar json de body
    const {username, email, password} = req.body
    //crea un user en la bd
    const usuario = models.user.create({
        username,
        email,
        password
    })
    .then(async(user) => {
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      //encrypt PASSWORD
      user.password = await user.encriptPassword(user.password)
      await user.save()

      //generar token del user.id pasando secretkey y con tiempo de expiracion 1 dia
      const token = jwt.sign({id:user.id}, jwtSecretKey,{
        expiresIn: 60 * 60 * 24
      })

      res.json({auth:true, token: token})

    }).catch(error => { //porque tira error de datos duplicados
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra user con el mismo nombre')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
});

router.post("/login", (req, res) => {

    const {email, password} = req.body
    // Then generate JWT Token
  
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    //encuentra usuario en BD
    const user = models.user.findOne({
      attributes: ["id", "password"],
      where: { email } 
    })
    .then( async (user)=>{
      //valida el pass obtenido con el que esta en la BD
      const passValidado = await user.validarPassword(password)

      //si falla devuelve null, return necesario por estar dentro de un promise
      if(!passValidado){
        return res.status(401).json({auth: "Fallo", token: null})
      }
      
      //devuelvo nuevo token para hacer querys
      const token = jwt.sign({id:user.id}, jwtSecretKey,{
        expiresIn: 60 * 60 * 24
      })
      res.json({auth: true, token: token});
    })
    .catch((error)=>{
      res.status(401).send(error)
    })
})

// Verification of JWT
router.get("/validateToken", verifyToken , async (req, res) => {
    try {
        await findUser(req.userId, {
          onSuccess: user => res.send(user),
          onNotFound: () => res.sendStatus(404),
          onError: () => res.sendStatus(500)
          })        
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});

const findUser = async (id, { onSuccess, onNotFound, onError }) => {
    await models.user
      .findOne({
        attributes: ["username", "email"],
        where: { id }
      })
      .then(user => (user ? onSuccess(user) : onNotFound()))
      .catch(() => onError());
  };

module.exports = router;