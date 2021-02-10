/**
 * @file production.js
 *
 * @description Production file is the default setup expected to have on a localmachine to work with the Production config
 *
 * @author  Payal <payal.ghusalikar9@gmail.com>
 * @version : 1.0
 -----------------------------------------------------------------------------------------------*/

const winston = require(`winston`);
const {
    createLogger,
    transports,
    format
} = require(`winston`);

winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
);


/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = config => {

    const { logDir } = config;

    // const DBDomain = process.env.COVID19_DB_PORT
    // 	? `${process.env.COVID19_DB_HOST}:${process.env.COVID19_DB_PORT}`
    // 	: `${process.env.COVID19_DB_HOST}`;
    // const CREDENTIALS = `${process.env.COVID19_DB_USERNAME}:${process.env.COVID19_DB_PASSWORD}`;

    return {
        port: process.env.NODE_PORT || 2001,

        // redisClientConfig: {
        //     redisEndPoint: process.env.COVID19_CACHE_REDIS_HOST,
        //     port: process.env.COVID19_CACHE_REDIS_PORT,
        //     flushRedisOnServerRestart: true,
        // },
        security: {
            application: () => this,
            config: null,
        },
        swagger: true,
        database: {
            mongodb: {
                //name: process.env.COVID19_DB_NAME,
                dbURI: process.env.MONGODB_URL,
            },
        },
        logger = createLogger({
            transports: [
                new transports.File({
                    filename: (`./log/error.log`),
                    level: `error`,
                    format: winston.format.combine(format.timestamp(), format.json())
                }),
                new transports.File({
                    filename: (`./log/warn.log`),
                    level: `warn`,
                    format: winston.format.combine(format.timestamp(), format.json())
                }),
                new transports.File({
                    filename: (`./log/info.log`),
                    level: `info`,
                    format: winston.format.combine(format.timestamp(), format.json())
                }),
            ]
        }),
        stream: {
            write: (message, encoding) => {
                this.loggers.info(message, encoding);
            },
        },
    }
}