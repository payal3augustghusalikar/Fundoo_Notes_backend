/**
 * @file development.js
 *
 * @description Development file is the default setup expected to have on a localmachine to work with the Production config
 *
 * @author  Payal <payal.ghusalikar9@gmail.com>
 -----------------------------------------------------------------------------------------------*/

const winston = require("winston");

/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = () => {
    return {
        port: process.env.PORT || 2001,
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
            mongodb: {
                // MONGODB_URL=mongodb://localhost:27017/fundooNotes
                dbURI: `mongodb+srv://${process.env.HOST}/${process.env.fundooNotes}`,

                // dbURL: process.env.MONGODB_URL,
            },
        },
    };
};