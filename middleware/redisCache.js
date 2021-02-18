const redis = require("redis");
const client = redis.createClient();
const config = require("../config").get();
const logger = require("../../logger/logger.js");

class RedisCache {
    /**
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    redisPost = (req, res, next) => {
        const userEmail = req.body.emailId;
        console.log("getting redis data : ");
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