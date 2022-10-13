const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); //archivo env 

function verifyToken(req, res, next){
<<<<<<< HEAD
//datos globales del token 
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    const token = req.header(tokenHeaderKey); //traer token
=======
    try{
    //let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; en el caso de no usar bearer
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    //const token = req.header(tokenHeaderKey); // devuelve value token, pero hay que pasar encabezado valido
    const bearerHeader = req.headers['authorization'] //key es Authorization, y value "Bearer token"
    
    if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      req.token = bearer[1]; // guarda token en req.token
>>>>>>> 6570624670ddf521a1d15d6a9949a28e9899a03d

    }
<<<<<<< HEAD
//el token q rescata del header lo compara con la clave secreta y devuelve el pilot (user id) y lo guarda en req.userId
    const decoded = jwt.verify(token, jwtSecretKey);
=======
    
    const decoded = jwt.verify(req.token, jwtSecretKey);
>>>>>>> 6570624670ddf521a1d15d6a9949a28e9899a03d
    req.userId = decoded.id;
    next();
    }catch{//validacion token null
      return res.json({auth: false, messege: "No se ingreso Token"})
    }
}
module.exports = verifyToken;