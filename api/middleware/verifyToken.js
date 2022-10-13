const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); //archivo env 

function verifyToken(req, res, next){
//datos globales del token 
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    const token = req.header(tokenHeaderKey); //traer token

    if(!token){//validacion token null
      return res.json({auth: false, messege: "No se ingreso Token"})
    }
//el token q rescata del header lo compara con la clave secreta y devuelve el pilot (user id) y lo guarda en req.userId
    const decoded = jwt.verify(token, jwtSecretKey);
    req.userId = decoded.id;
    next();
}
module.exports = verifyToken;