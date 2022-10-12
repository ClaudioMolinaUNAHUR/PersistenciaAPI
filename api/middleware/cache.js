const getExpeditiousCache = require('express-expeditious');

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