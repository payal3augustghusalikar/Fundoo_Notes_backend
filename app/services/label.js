const Label = require("../models/label.js");

const helper = require("../../middleware/helper.js");

class LabelService {
    /**
     * @description Create and save Label then send response to controller
     * @method create is used to save the Label
     * @param callback is the callback for controller
     */
    create = async(labelInfo, token, callback) => {
        //  console.log("token in service : " + token);
        // create a Label
        labelInfo = await helper.decodeToken(labelInfo, token);
        return Label.create(labelInfo, callback);
    };

    /**
     * @description Find all the Labels and return response to controller
     * @method findAll is used to retrieve Labels
     * @param callback is the callback for controller
     */
    findAll = (callback) => {
        console.log("service");
        Label.findAll((error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                return callback(null, data);
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
        //labelInfo = helper.decodeToken(labelInfo, token);
        const data = await Label.update(labelInfo, callback);
        return data;
    };

    /**
     * @description Delete Label by id and return response to controller
     * @method deleteById is used to remove Label by ID
     * @param callback is the callback for controller
     */
    delete = (LabelID, callback) => {
        return Label.deleteById(LabelID, callback);
    };
}

module.exports = new LabelService();