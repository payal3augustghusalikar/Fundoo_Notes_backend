const redis = require("redis");
const client = redis.createClient();
const config = require("../config").get();
const logger = require("../../logger/logger.js");
const helper = require("./helper.js");

client.on("connect", function() {
    console.log("Connected to Redis");
});

client.on("error", function(err) {
    console.log("Redis error: " + err);
});

class RedisCache {
    /**
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    redisGetLogin = (req, res, next) => {
        const userEmail = req.body.emailId;
        console.log("get email :", userEmail);

        //let token = req.headers.authorization.split(" ")[1];
        //  const getEmailFromToken(token)
        console.log("inside redis");
        client.get(`process.env.REDIS_KEY ${userEmail}`, (error, redisData) => {
            return (
                error ?
                logger.error("Error retrieving data from redis cache") :
                logger.info("retrieving data from redis cache"),
                console.log("redisData : " + JSON.parse(redisData)),
                JSON.parse(redisData)
            );
        });
        next();
    };

    /**
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    redisGet = (req, res, next) => {
        let token = req.headers.authorization.split(" ")[1];
        const userEmail = helper.getEmailFromToken(token);
        console.log("get email :", userEmail);
        console.log("inside redis");
        client.get(`process.env.REDIS_KEY ${userEmail}`, (error, redisData) => {
            return (
                error ?
                logger.error("Error retrieving data from redis cache") :
                logger.info("retrieving data from redis cache"),
                console.log("redisData : " + JSON.parse(redisData)),
                JSON.parse(redisData)
            );
        });
        next();
    };
    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     */
    setRedis = (data, userEmail) => {
        console.log("userId for redis is: " + userEmail);
        return client.setex(
            `process.env.REDIS_KEY ${userEmail}`,
            2000,
            JSON.stringify(data)
        );
    };
}

module.exports = new RedisCache();