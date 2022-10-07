var express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const models = require('./models');
//const user = require("./models/user");


dotenv.config();

router.post("/register", (req, res) => {
    // recuperar json de body
    const {username, email, password} = req.body
    //crea un user en la bd
    const user = models.user.create({
        username,
        email,
        password
    })
    .then(() => {user.password = user.encriptPassword(user.password)}) // FALTA ARREGLAR
    .then( (usuario) => {
  
    res.status(201).send({ id: usuario.id });

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

    const user = req.body.user;
    const password = req.body.password;
    // Then generate JWT Token
  
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    const encontrado = findUser(user, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
      });
  
    const token = jwt.sign(encontrado, jwtSecretKey);
  
    res.send(token);
});

// Verification of JWT
router.get("/validateToken", (req, res) => {
    // Tokens are generally passed in header of request
    // Due to security reasons.
  
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {
        const token = req.header(tokenHeaderKey);
  
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            return res.send("Successfully Verified");
        }else{
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});

const findUser = (user, { onSuccess, onNotFound, onError }) => {
    const id = user.id
    models.alumno
      .findOne({
        attributes: ["username", "email", "password"],
        where: { id }
      })
      .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
      .catch(() => onError());
  };

module.exports = router;