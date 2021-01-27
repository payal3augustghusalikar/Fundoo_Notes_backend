const winston = require(`winston`);
const {
    createLogger,
    transports,
    format
} = require(`winston`);

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
};

winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
);

const logger = createLogger({
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
})

module.exports = logger;