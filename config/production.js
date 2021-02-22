/**
 * @file production.js
 *
 * @description Production file is the default setup expected to have on a localmachine to work with the Production config
 *
 * @author  Payal <payal.ghusalikar9@gmail.com>
 * @version : 1.0
 -----------------------------------------------------------------------------------------------*/

const winston = require("winston");

/**
 * @exports : Exports production Config Environment based Configuration
 */
module.exports = () => {
    return {
        port: process.env.PROD_APP_PORT || 3000,
        logger: winston.createLogger({
            format: winston.format.json(),
            transports: [
                new winston.transports.File({
                    filename: "./log/error.log",
                    level: "error",
                }),
                new winston.transports.File({
                    filename: "./log/info.log",
                    level: "info",
                }),
            ],
        }),
        database: {
            dbURI: `mongodb+srv://${process.env.HOST}/${process.env.fundooNotes}`,
        },
    };
};