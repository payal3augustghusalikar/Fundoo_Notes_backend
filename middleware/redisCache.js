const redis = require("redis");
const client = redis.createClient();
const config = require("../config").get();

class RedisCache {
    redisPost = (req, res, next) => {
        client.get(loginData, (error, data) => {
            if (error) {
                logger.error("Error retrieving data from redis cache");
                return callBack(error, null);
            } else if (data) {
                logger.error("retrieving data from redis cache");
                return callBack(null, data);
            }
            next();
        });
    };
}

module.exports = new RedisCache();