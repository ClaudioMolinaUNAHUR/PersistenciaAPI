const getExpeditiousCache = require('express-expeditious');
//guardar en memoria cache las consultas de base de datos  y responder de forma mas rapida las peticiones
//Un middleware exprés que simplifica el almacenamiento en caché de las respuestas de las solicitudes HTTP de cualquier tipo. 
const defaultOptions = {
    namespace: 'expresscache',
    defaultTtl: '1 minute', // Almacena entradas de caché durante 1 minuto
    statusCodeExpires: {
        404: '5 minutes',
        500: 0 
    }
// , con redis
//    engine: require('expeditious-engine-redis')({
//        host: 'redis.acme.com',
//        port: 6379
//    }) 
}

const cacheInit = getExpeditiousCache(defaultOptions)

module.exports = { cacheInit }