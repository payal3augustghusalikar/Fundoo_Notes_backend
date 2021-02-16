/**
 * @module       services
 * @file         note.js
 * @description  holds the methods calling from controller
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-------------------------------------------------------------------------------------*/
const Note = require("../models/note.js");

const helper = require("../../middleware/helper.js");

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
    findAll = (callback) => {
        Note.findAll(callback);
    };

    /**
     * @description Find Note by id and return response to controller
     * @method findOne is used to retrieve Note by ID
     * @param callback is the callback for controller
     */
    findOne = (noteID, callback) => {
        Note.findOne(noteID, callback);
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