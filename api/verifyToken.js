const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function verifyToken(req, res, next){

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    const token = req.header(tokenHeaderKey);

    if(!token){//validacion token null
      return res.json({auth: false, messege: "No se ingreso Token"})
    }

    const decoded = jwt.verify(token, jwtSecretKey);
    req.userId = decoded.id;
    next();
}
module.exports = verifyToken;