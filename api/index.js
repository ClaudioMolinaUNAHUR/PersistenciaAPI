var express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const models = require('./models')


dotenv.config();

// Main Code Here  //
// Generating JWT
router.post("/register", (req, res) => {
    // Validate User Here
    const {username, email, password} = req.body
    // Then generate JWT Token
  
    //let jwtSecretKey = process.env.JWT_SECRET_KEY;

    models.user.create({
        username: username,
        email: email,
        password: password
    })
    .then( (usuario) => {
  
    //const token = jwt.sign(data, jwtSecretKey);
  
    res.status(201).send({ id: usuario.id });
    }).catch(error => {
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

    let data = {
        user,
        password,
    }
  
    const token = jwt.sign(data, jwtSecretKey);
  
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
module.exports = router;