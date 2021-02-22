/**
 * @module       services
 * @file         note.js
 * @description  holds the methods calling from controller
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-------------------------------------------------------------------------------------*/
const Note = require("../models/note.js");

const helper = require("../../middleware/helper.js");
const logger = require("../../logger/logger.js");
const redis = require("redis");
const client = redis.createClient();
var redisCache = require("../../middleware/redisCache.js");

class NoteService {
    /**
     * @description Create and save Note then send response to controller
     * @method create is used to save the Note
     * @param callback is the callback for controller
     */
    create = (noteInfo, token, callback) => {
        // create a Note
        noteInfo = helper.decodeToken(noteInfo, token);
        Note.create(noteInfo, callback);
    };

    /**
     * @description Find all the Notes and return response to controller
     * @method findAll is used to retrieve Notes
     * @param callback is the callback for controller
     */
    findAll = (token, callback) => {
        console.log("service");
        const userEmail = helper.getEmailFromToken(token);
        console.log("get email :", userEmail);
        Note.findAll((error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("from database ", data);
                const redisData = redisCache.setRedisNotes(data, userEmail);
                console.log("setting redis data : " + redisData);
                return callback(null, data);
            }
        });
    };

    /**
     * @description Find Note by id and return response to controller
     * @method findOne is used to retrieve Note by ID
     * @param callback is the callback for controller
     */
    findOne = (noteID, callback) => {
        Note.findOne(noteID, (error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                return callback(null, data);
            }
        });
    };

    /**
     * @description Update Note by id and return response to controller
     * @method update is used to update Note by ID
     * @param callback is the callback for controller
     */
    update = (noteInfo, callback) => {
        Note.update(noteInfo, callback);
    };

    /**
     * @description Delete Note by id and return response to controller
     * @method deleteById is used to remove Note by ID
     * @param callback is the callback for controller
     */
    delete = (noteID, callback) => {
        Note.deleteById(noteID, callback);
    };
}
module.exports = new NoteService();