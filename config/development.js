/**
 * @file development.js
 *
 * @description Development file is the default setup expected to have on a localmachine to work with the Production config
 *
 * @author  Payal <payal.ghusalikar9@gmail.com>
 -----------------------------------------------------------------------------------------------*/

const winston = require("winston");
//const { createLogger, transports, format } = require(`winston`);

/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = () => {
  return {
    port: process.env.DEV_APP_PORT || 3000,
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
    // redisClientConfig: {
    //   redisEndPoint: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    //   flushRedisOnServerRestart: true,
    // },
    database: {
      dbURL: process.env.MONGODB_URL,
    },
  };
};
