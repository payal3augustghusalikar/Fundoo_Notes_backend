/**
 * @module       Middleware
 * @file         redisCache.js
 * @description  holds the redis get and set  reusable methods calling from service class
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const redis = require("redis");
const client = redis.createClient();
const logger = require("../../logger/logger.js");

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
        const KEY = `${key}${userEmail}`;
        return client.get(KEY, (error, redisData) => {
            return (
                error || redisData == null ?
                (logger.error("Error retrieving data from redis cache", +error),
                    callback(error, null)) :
                logger.info("data found in redis "),
                callback(null, JSON.parse(redisData))
            );
        });
    };

    /**
     * @description set the data in rediscache
     * @param {*} data is the responce from database
     * @param {*} userEmail for unique identity
     * @param {*} key is for unique key to set spcific data
     */
    setRedis = (data, userEmail, key) => {
        const KEY = `${key}${userEmail}`;
        return client.setex(KEY, 20000000, JSON.stringify(data));
    };
}
module.exports = new RedisCache();