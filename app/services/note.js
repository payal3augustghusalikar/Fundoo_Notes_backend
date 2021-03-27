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
const key = "note";


class NoteService {
    /**
     * @description Create and save Note then send response to controller
     * @method create is used to save the Note
     * @param callback is the callback for controller
     */
    create = (noteInfo, token, callback) => {
        // create a Note
        noteInfo = helper.decodeToken(noteInfo, token);
        const userEmail = helper.getEmailFromToken(token);
        return Note.create(noteInfo, (error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                Note.findAll((error, AllData) => {
                    if (error) {
                        logger.error("Some error occurred");
                        return callback(new Error("Some error occurred"), null);
                    } else {
                        redisCache.setRedis(AllData, userEmail, key);
                        return callback(null, data);
                    }
                });

            }
        });
    };




    /**
     * @description Find all the Notes and return response to controller
     * @method findAll is used to retrieve Notes
     * @param callback is the callback for controller
     */
    findAll = (token, callback) => {
        const userEmail = helper.getEmailFromToken(token);
        redisCache.redisGet(userEmail, key, (error, data) => {
            if (data) {
                return callback(null, data);
            } else if (!data) {
                return Note.findAll((error, data) => {
                    if (error) {
                        logger.error("Some error occurred");
                        return callback(new Error("Some error occurred"), null);
                    } else {
                        redisCache.setRedis(data, userEmail, key);
                        return callback(null, data);
                    }
                });
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
    update = (noteInfo, token, callback) => {
        console.log("inside update")
        const userEmail = helper.getEmailFromToken(token);
        return Note.update(noteInfo, (error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                // console.log("data", data)
                return Note.findAll((error, AllData) => {
                    if (error) {
                        logger.error("Some error occurred");
                        return callback(new Error("Some error occurred"), null);
                    } else {

                        redisCache.setRedis(AllData, userEmail, key);
                        return callback(null, data);
                    }
                });

            }
        });
    };




    // /**
    //  * @description hard Delete Note by id and return response to controller
    //  * @method deleteById is used to remove Note by ID
    //  * @param callback is the callback for controller
    //  */
    // delete = (noteID, callback) => {
    //     console.log("delete ser")
    //     return Note.deleteById(noteID, callback);
    // };





    /**
     * @description add label to note
     * @method add calls model class method
     */
    addLabelToNotes = (noteData, token, callback) => {
        return Note.addLabelToSingleNote(noteData, (error, result) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("key in ser", key)
                helper.updateRedisData(token, key)
                return callback(null, result);
            }
        })
    };

    /**
     * @description remove label to note
     * @method add calls model class method
     */
    removeLabel = (noteData, token, callback) => {
        return Note.removeLabel(noteData, (error, result) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("key in ser", key)
                helper.updateRedisData(token, key)
                return callback(null, result);
            }
        })
    };

    /**
     * @description Delete Note by id and return response to controller(harddelete)
     * @method deleteById is used to remove Note by ID
     * @param callback is the callback for controller
     */
    deleteNote = (noteID, token, callback) => {
        console.log("delete ser")
        return Note.deleteNoteById(noteID, (error, result) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("key in ser", key)
                helper.updateRedisData(token, key)
                console.log("resultser", result)
                return callback(null, result);
            }
        })
    };

    /**
     * @description Delete Note by id and return response to controller (softdelete)
     * @method deleteById is used to remove Note by ID
     * @param callback is the callback for controller
     */

    removeNote = (noteID, token, callback) => {
        return Note.removeNote(noteID, (error, result) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("key in ser", key)
                helper.updateRedisData(token, key)
                return callback(null, result);
            }
        })
    }



    /**
     * @description Delete Note by id and return response to controller
     * @method deleteById is used to remove Note by ID
     * @param callback is the callback for controller
     */
    restore = (noteID, token, callback) => {
        return Note.restore(noteID, (error, result) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("key in ser", key)
                helper.updateRedisData(token, key)
                return callback(null, result);
            }
        })
    }

    /**
     * @description adds new collaborator to note
     * @param {*} collaborator
     */
    createCollaborator = async(collaborator, token) => {
        const data = await Note.findCollaborator(collaborator);
        helper.updateRedisData(token, key)
        return data;
    };

    /**
     * @description delete  collaborator
     * @method delete calls model class method
     */
    removeCollaborator = (collaboratorData, token, callback) => {
        return Note.removeCollaborator(collaboratorData, (error, result) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("key in ser", key)
                helper.updateRedisData(token, key)
                return callback(null, result);
            }
        })

    };
}

module.exports = new NoteService();