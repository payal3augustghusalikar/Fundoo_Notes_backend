const Note = require('../models/note.js');

class NoteService {
    /**
     * @description Create and save Note then send response to controller
     * @method create is used to save the Note
     * @param callback is the callback for controller
     */
    create = (noteInfo, callback) => {
        // create a Note
        Note.create(noteInfo, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        })
    }

    /**
     * @description Find all the Notes and return response to controller
     * @method findAll is used to retrieve Notes
     * @param callback is the callback for controller
     */
    findAll = (callback) => {
        Note.findAll((error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }

    /**
     * @description Find Note by id and return response to controller
     * @method findOne is used to retrieve Note by ID
     * @param callback is the callback for controller
     */
    findOne = (noteID, callback) => {
        Note.findOne(noteID, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }

    /**
     * @description Update Note by id and return response to controller
     * @method update is used to update Note by ID
     * @param callback is the callback for controller
     */
    update = (noteInfo, callback) => {
        Note.update(noteInfo, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }

    /**
     * @description Delete Note by id and return response to controller
     * @method deleteById is used to remove Note by ID
     * @param callback is the callback for controller
     */
    delete = (noteID, callback) => {
        Note.deleteById(noteID, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }
}

module.exports = new NoteService();