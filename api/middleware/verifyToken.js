const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); //archivo env 

function verifyToken(req, res, next){
    try{
    //let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; en el caso de no usar bearer
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    //const token = req.header(tokenHeaderKey); // devuelve value token, pero hay que pasar encabezado valido
    const bearerHeader = req.headers['authorization'] //key es Authorization, y value "Bearer token"
    
    if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      req.token = bearer[1]; // guarda token en req.token

    }
    
    const decoded = jwt.verify(req.token, jwtSecretKey);
    req.userId = decoded.id;
    next();
    }catch{//validacion token null
      return res.json({auth: false, messege: "No se ingreso Token"})
    }
}
module.exports = verifyToken;