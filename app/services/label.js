const Label = require("../models/label.js");

const helper = require("../../middleware/helper.js");
const redis = require("redis");
const client = redis.createClient();
var redisCache = require("../../middleware/redisCache.js");
class LabelService {
    /**
     * @description Create and save Label then send response to controller
     * @method create is used to save the Label
     * @param callback is the callback for controller
     */
    create = async(labelInfo, token, callback) => {
        labelInfo = await helper.decodeToken(labelInfo, token);
        return Label.create(labelInfo, callback);
    };

    /**
     * @description Find all the Labels and return response to controller
     * @method findAll is used to retrieve Labels
     * @param callback is the callback for controller
     */
    findAll = async(token, callback) => {
        console.log("service");
        const userEmail = await helper.getEmailFromToken(token);
        console.log("get email :", userEmail);
        return Label.findAll((error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                // const key = "label";
                //  const redisData = redisCache.setRedis(data, userEmail, key);
                const redisData = redisCache.setRedisLabel(data, userEmail);
                console.log("setting redis data : " + redisData);
                return data;
            }
        });
    };

    /**
     * @description Find Label by id and return response to controller
     * @method findOne is used to retrieve Label by ID
     * @param callback is the callback for controller
     */
    findOne = (LabelID, callback) => {
        return Label.findOne(LabelID, callback);
    };

    /**
     * @description Update Label by id and return response to controller
     * @method update is used to update Label by ID
     * @param callback is the callback for controller
     */
    update = async(labelInfo, callback) => {
        const data = await Label.update(labelInfo, callback);
        return data;
    };

    /**
     * @description Delete Label by id and return response to controller
     * @method deleteById is used to remove Label by ID
     * @param callback is the callback for controller
     */
    delete = async(labelID, callback) => {
        const data = await Label.deleteById(labelID, callback);
        return data;
    };
}

module.exports = new LabelService();