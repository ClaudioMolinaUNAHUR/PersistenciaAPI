var express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const models = require('./models');


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
  
        const decoded = jwt.verify(token, jwtSecretKey);
        if(decoded){
          findUser(decoded.id, {
            onSuccess: user => res.send(user),
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
            })
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});

const findUser = (id, { onSuccess, onNotFound, onError }) => {
    models.user
      .findOne({
        attributes: ["username", "email", "password"],
        where: { id }
      })
      .then(user => (user ? onSuccess(user) : onNotFound()))
      .catch(() => onError());
  };

module.exports = router;