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
     * @description this methods calls from routes to check redis data
     * @param {*} userEmail is to take email
     * @param {*} key is for unique key
     * @param {*} callback calls service class method and passed the data if found
     */
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
                    console.log(
                        "data found in redis "
                        // JSON.parse(redisData)
                    ),
                    logger.info(
                        "data found in redis "
                        // JSON.parse(redisData)
                    ),
                    callback(null, JSON.parse(redisData))
                );
            }
        );
    };

    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     * @param {*} key is for unique key to set spcific data
     */

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
}
module.exports = new RedisCache();