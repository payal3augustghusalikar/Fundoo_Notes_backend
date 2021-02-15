/**
 * @module       services
 * @file         label.js
 * @description  holds the methods calling from controller
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-------------------------------------------------------------------------------------*/

const Label = require("../models/label.js");

const helper = require("../../middleware/helper.js");

//const logger = require("../../../logger/logger.js");

class LabelService {
    /**
     * @description Create and save Label then send response to controller
     * @method create is used to save the Label
     * @param callback is the callback for controller
     */
    create = (labelInfo, token, callback) => {
        // create a Label
        labelInfo = helper.decodeToken(labelInfo, token);
        Label.create(labelInfo, callback);
    };

    /**
     * @description Find all the Labels and return response to controller
     * @method findAll is used to retrieve Labels
     * @param callback is the callback for controller
     */
    findAll = (callback) => {
        Label.findAll(callback);
    };

    /**
     * @description Find Label by id and return response to controller
     * @method findOne is used to retrieve Label by ID
     * @param callback is the callback for controller
     */
    findNotesByLabel = (LabelID, callback) => {
        Label.findNotesByLabel(LabelID, callback);
    };

    /**
     * @description Update Label by id and return response to controller
     * @method update is used to update Label by ID
     * @param callback is the callback for controller
     */
    update = (labelInfo, callback) => {
        Label.update(labelInfo, callback);
    };

    /**
     * @description Delete Label by id and return response to controller
     * @method deleteById is used to remove Label by ID
     * @param callback is the callback for controller
     */
    delete = (LabelID, callback) => {
        Label.deleteById(LabelID, callback);
    };
}

module.exports = new LabelService();