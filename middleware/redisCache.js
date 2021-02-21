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

checkCacheData = (userEmail, res, next) => {
    return client.get(
        `process.env.REDIS_KEY ${userEmail}`,
        (error, redisData) => {
            console.log("start : ", redisData);
            return error || redisData == null ?
                (console.log("no data in redis"),
                    logger.error("Error retrieving data from redis cache"),
                    next()) :
                (console.log("redisDataa : " + JSON.parse(redisData)),
                    res.send({
                        success: true,
                        status_code: 200,
                        message: `data found`,
                        redisData: JSON.parse(redisData),
                    }));
        }
    );
};

class RedisCache {
    /**
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    redisGet = async(req, res, next) => {
        var start = new Date();
        const userEmail = req.body.emailId;
        console.log("get email from body :", userEmail);
        if (userEmail == undefined) {
            const token = req.headers.authorization.split(" ")[1];
            const userEmail = helper.getEmailFromToken(token);
            console.log("get email from token:", userEmail);
            console.log("inside note or label");
            const data = await checkCacheData(userEmail, res, next);
            console.log("return from check cache: ", data);
            console.log("Request took2:", new Date() - start, "ms");
        } else {
            console.log("for login");
            const data = await checkCacheData(userEmail, res, next);
            console.log("return from check cache: ", data);
            console.log("Request took1:", new Date() - start, "ms");
        }
    };

    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     */
    setRedis = (data, userEmail) => {
        console.log("userId for redis is: " + userEmail);
        console.log("set Data : ", data);
        return client.setex(
            `process.env.REDIS_KEY ${userEmail}`,
            30,
            JSON.stringify(data)
        );
    };
}

module.exports = new RedisCache();