const redis = require("redis");
const client = redis.createClient();
const config = require("../config").get();
const logger = require("../../logger/logger.js");
const helper = require("./helper.js");
const status = require("../middleware/staticFile.json");

client.on("connect", function() {
    console.log("Connected to Redis");
});

client.on("error", function(err) {
    console.log("Redis error: " + err);
});

class RedisCache {
    /**
     * @description this methods calls from routes to check redis data for label
     * @param {*} req is to take email from body
     * @param {*} res to send response
     * @param {*} next is pass as a argument
     */
    // redisGetLabel = (req, res, next) => {
    //     const token = req.headers.authorization.split(" ")[1];
    //     const userEmail = helper.getEmailFromToken(token);
    //     return client.get(
    //         `process.env.LABEL_REDIS_KEY${userEmail}`,
    //         // `userData label ${userEmail}`,
    //         (error, redisData) => {
    //             console.log("start : ", redisData);
    //             return error || redisData == null ?
    //                 (logger.error("Error retrieving data from redis cache"), next()) :
    //                 res.send({
    //                     status_code: status.Success,
    //                     message: `data found`,
    //                     redisData: JSON.parse(redisData),
    //                 });
    //         }
    //     );
    // };

    redisGet = (userEmail, key, callback) => {
        console.log("inside get redis ");
        console.log(`process.env.REDIS_KEY${key}${userEmail}`);
        return client.get(
            `process.env.REDIS_KEY${key}${userEmail}`,
            (error, redisData) => {
                return (
                    error || redisData == null ?
                    (logger.error("Error retrieving data from redis cache", +error),
                        console.log("no data in getredis"),
                        callback(error, null)) :
                    console.log("data found in redis ", JSON.parse(redisData)),
                    callback(null, JSON.parse(redisData))
                );
            }
        );
    };

    /**
     * @description this methods calls from routes to check redis data for notes
     * @param {*} req is to take email from body
     * @param {*} res to send response
     * @param {*} next is pass as a argument
     */
    redisGetNotes = (req, res, next) => {
        console.log("");
        console.log("redisGetNotes");
        const token = req.headers.authorization.split(" ")[1];
        const userEmail = helper.getEmailFromToken(token);
        console.log("get email from token:", userEmail);
        console.log("getting redis data : ");
        console.log("inside redis");
        return client.get(
            `process.env.NOTES_REDIS_KEY${userEmail}`,
            (error, redisData) => {
                console.log("start : ", redisData);
                return error || redisData == null ?
                    (console.log("no data in redis"),
                        logger.error("Error retrieving data from redis cache"),
                        next()) :
                    (console.log("redisDataa : " + JSON.parse(redisData)),
                        res.send({
                            status_code: status.Success,
                            message: `data found`,
                            redisData: JSON.parse(redisData),
                        }));
            }
        );
    };

    /**
     * @description this methods calls from routes to check redis data for Login
     * @param {*} req is to take email from body
     * @param {*} res to send response
     * @param {*} next is pass as a argument
     */
    redisGetLogin = (req, res, next) => {
        console.log("");
        console.log("redisGetLogin");
        const userEmail = req.body.emailId;
        console.log("getting redis data : ");
        console.log("inside redis");
        return client.get(
            `process.env.LOGIN_REDIS_KEY${userEmail}`,
            (error, redisData) => {
                console.log("start : ", redisData);
                return error || redisData == null ?
                    (console.log("no data in redis"),
                        logger.error("Error retrieving data from redis cache"),
                        next()) :
                    (console.log("redisDataa : " + JSON.parse(redisData)),
                        res.send({
                            status_code: status.Success,
                            message: `data found`,
                            redisData: JSON.parse(redisData),
                        }));
            }
        );
    };

    //     /**
    //      * @description set the data in rediscache
    //      * @param {*} data is the responce from database
    //      * @param {*} userEmail for unique identity
    //      */
    //     setRedis = (data, userEmail, key) => {
    //         console.log("userId for redis is: " + userEmail);
    //         console.log("set Data : ", data);
    //         return client.setex(
    //             `process.env.REDIS_KEY ${key} ${userEmail}`,
    //             2000,
    //             JSON.stringify(data)
    //         );
    //     };
    // }

    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     */
    setRedisLogin = (data, userEmail) => {
        console.log("userId for redis is: " + userEmail);
        console.log("set Data : ", data);
        return client.setex(
            `process.env.LOGIN_REDIS_KEY${userEmail}`,
            20000000,
            JSON.stringify(data)
        );
    };

    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     */
    // setRedisLabel = (data, userEmail) => {
    //     console.log("userId for redis is: " + userEmail);
    //     return client.setex(
    //         `process.env.LABEL_REDIS_KEY${userEmail}`,
    //         20000000,
    //         JSON.stringify(data)
    //     );
    // };

    setRedis = (data, userEmail, key) => {
        console.log("");
        console.log("inside set redis", data);
        console.log(key);
        console.log("userId for redis is: " + userEmail);
        console.log(`process.env.REDIS_KEY${key}${userEmail}`);
        return client.setex(
            `process.env.REDIS_KEY${key}${userEmail}`,
            20000000,
            JSON.stringify(data)
        );
    };

    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     */
    setRedisNotes = (data, userEmail) => {
        console.log("userId for redis is: " + userEmail);
        console.log("set Data : ", data);
        return client.setex(
            `process.env.NOTES_REDIS_KEY${userEmail}`,
            20000000,
            JSON.stringify(data)
        );
    };
}
module.exports = new RedisCache();