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

CheckCacheData = (userEmail, res, next) => {
    return client.get(
        `process.env.REDIS_KEY ${userEmail}`,
        (error, redisData) => {
            return (
                error || redisData == null ?
                (console.log("no data in redis"),
                    logger.error("Error retrieving data from redis cache")) :
                logger.info("retrieving data from redis cache"),
                console.log("redisDataa : " + JSON.parse(redisData)),
                JSON.parse(redisData),
                res.send({
                    success: true,
                    status_code: 200,
                    message: `note found`,
                    redisData: JSON.parse(redisData),
                })
            );
        }
    );
};

class RedisCache {
    /**
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    redisGet = (req, res, next) => {
        var start = new Date();
        const userEmail = req.body.emailId;
        console.log("get email from body :", userEmail);
        if (userEmail == undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const userEmail = helper.getEmailFromToken(token);
            console.log("get email from token:", userEmail);
            console.log("inside note or label");
            const data = CheckCacheData(userEmail, res, next);
            console.log("return from check cache: ", data);
            data == true ?
                next() :
                console.log("Request took:", new Date() - start, "ms");
            // console.log(data);
            // res.send({
            //     success: true,
            //     status_code: 200,
            //     message: `note found`,
            //     data: data,
            // });
            //  next();
            // return client.get(
            //     `process.env.REDIS_KEY ${userEmail}`,
            //     (error, redisData) => {
            //         return (
            //             error || redisData == null ?
            //             (logger.error("Error retrieving data from redis cache"), next()) :
            //             logger.info("retrieving data from redis cache"),
            //             console.log("redisData : " + JSON.parse(redisData)),
            //             JSON.parse(redisData)

            //         );
            //     }
            // );
        } else {
            console.log("for login");
            CheckCacheData(userEmail, res, next);
            console.log("Request took:", new Date() - start, "ms");
            // client.get(`process.env.REDIS_KEY ${userEmail}`, (error, redisData) => {
            //     return (
            //         error || redisData == null ?
            //         (logger.error("Error retrieving data from redis cache"), next()) :
            //         logger.info("retrieving data from redis cache"),
            //         console.log("redisData : " + JSON.parse(redisData)),
            //         JSON.parse(redisData)
            //     );
            // });
        }
    };

    /**
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    // redisGet = (req, res, next) => {
    //     let token = req.headers.authorization.split(" ")[1];
    //     const userEmail = helper.getEmailFromToken(token);
    //     console.log("get email :", userEmail);
    //     console.log("inside redis");
    //     client.get(`process.env.REDIS_KEY ${userEmail}`, (error, redisData) => {
    //         return (
    //             error || redisData == null ?
    //             (logger.error("Error retrieving data from redis cache"), next()) :
    //             logger.info("retrieving data from redis cache"),
    //             //  console.log("redisData : " + JSON.parse(redisData)),
    //             JSON.parse(redisData)
    //         );
    //     });
    //     next();
    // };

    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     */
    setRedis = (data, userEmail) => {
        console.log("userId for redis is: " + userEmail);
        return client.setex(
            `process.env.REDIS_KEY ${userEmail}`,
            100,
            JSON.stringify(data)
        );
    };
}

module.exports = new RedisCache();