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
    findAll = (token, callback) => {
        const key = "label";
        const userEmail = helper.getEmailFromToken(token);
        redisCache.redisGet(userEmail, key, (error, data) => {
            if (data) {
                return callback(null, data);
            } else if (!data) {
                Label.findAll((error, data) => {
                    if (error) {
                        logger.error("Some error occurred");
                        return callback(new Error("Some error occurred"), null);
                    } else {
                        const redisData = redisCache.setRedis(data, userEmail, key);

                        return callback(null, data);
                    }
                });
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