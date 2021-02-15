const Label = require("../models/label.js");

const helper = require("../../middleware/helper.js");

class LabelService {
    /**
     * @description Create and save Label then send response to controller
     * @method create is used to save the Label
     */
    create = (labelInfo, token) => {
        // create a Label
        labelInfo = helper.decodeToken(labelInfo, token);
        return Label.create(labelInfo);
    };

    /**
     * @description Find all the Labels and return response to controller
     * @method findAll is used to retrieve Labels
     */
    findAll = () => {
        return Label.findAll();
    };

    /**
     * @description Find Label by id and return response to controller
     * @method findOne is used to retrieve Label by ID
     */
    findOne = (LabelId) => {
        return Label.findOne(LabelId);
    };

    /**
     * @description Update Label by id and return response to controller
     * @method update is used to update Label by ID
     */
    update = (labelInfo) => {
        labelInfo = helper.decodeToken(labelInfo, token);
        return Label.update(labelInfo);
    };

    /**
     * @description Delete Label by id and return response to controller
     * @method deleteById is used to remove Label by ID
     */
    delete = (labelID) => {
        return Label.deleteById(labelID);
    };

    /**
     * @description Find Label by id and return response to controller
     * @method findOne is used to retrieve Label by ID
     */
    findLabelByUserId = (userID) => {
        return Label.findLabelByUserId(userID);
    };
}

module.exports = new LabelService();