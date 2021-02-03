const noteService = require('../services/note.js');
const Joi = require('joi');
const logger = require('../../logger/logger.js');

const ControllerDataValidation = Joi.object({
    title: Joi.string().regex(/^[a-zA-Z ]+$/).min(3).required(),
    description: Joi.string().regex(/^[a-zA-Z ]+$/).min(3).required()
})


class NoteController {
    /**
     * @description Create and save a new note
     * @param res is used to send the response
     */
    create = (req, res) => {
        const noteInfo = {
            title: req.body.title,
            description: req.body.description
        }
        const validation = ControllerDataValidation.validate(noteInfo);
        if (validation.error) {
            return res.status(400).send({
                success: false,
                description: "please enter valid details"
            });
        }
        noteService.create(noteInfo, (error, data) => {
            if (error) {
                logger.error("Some error occurred while creating note")
                return res.status(500).send({
                    success: false,
                    description: "Some error occurred while creating note"
                });
            }
            logger.info("note added successfully !")
            res.status(200).send({
                success: true,
                description: "note added successfully !",
                data: data
            });
        });
    }

    /**
     * @description Find all the note
     * @method findAll is service class method
     */
    findAll = (req, res) => {

        noteService.findAll((error, data) => {
            try {
                if (error) {
                    logger.error("Some error occurred while retrieving notes");
                    res.send({
                        success: false,
                        status_code: 404,
                        description: `note not found`,
                    });
                }
                logger.info("Successfully retrieved notes !");
                res.send({
                    success: true,
                    status_code: 200,
                    description: `note found`,
                    data: (data)
                });
            } catch (error) {
                logger.error("note not found");
                res.send({
                    success: false,
                    status_code: 500,
                    description: `note not found`,
                });
            }
        });
    }

    /**
     * @description Find note by id
     * @method findOne is service class method
     * @param response is used to send the response
     */
    findOne = (req, res) => {
        try {
            const noteID = req.params.noteId;
            noteService.findOne(noteID, (error, data) => {
                if (error) {
                    logger.error("Error retrieving note with id " + noteID)
                    return res.status(500).send({
                        success: false,
                        description: "Error retrieving note with id " + noteID
                    });
                }
                if (!data) {
                    logger.warn("Note not found with id : " + noteID)
                    return res.status(404).send({
                        success: false,
                        description: "Note not found with id : " + noteID
                    });
                }
                logger.info("note found with id " + req.params.noteID);
                return res.send({
                    success: true,
                    status_code: 200,
                    description: "Note found with id " + req.params.noteID,
                    data: (data)
                })
            });
        } catch (error) {
            logger.error("could not found note with id" + req.params.noteID);
            return res.send({
                success: false,
                status_code: 500,
                description: "error retrieving note with id " + req.params.noteID
            })
        }
    }


    /**
     * @description Update note by id
     * @method update is service class method
     * @param res is used to send the response
     */
    update = (req, res) => {
        try {
            const noteInfo = {
                title: req.body.title,
                description: req.body.description,
                noteID: req.params.noteId
            }
            noteService.update(noteInfo, (error, data) => {
                if (error) {
                    logger.error("Error updating note with id : " + req.params.noteId)
                    return res.send({
                        success: false,
                        status_code: 500,
                        description: "Error updating note with id : " + req.params.noteId
                    });
                }
                if (!data) {
                    logger.warn("note not found with id : " + req.params.noteId)
                    return res.send({

                        success: false,
                        status_code: 404,
                        description: "note not found with id : " + req.params.noteId
                    });
                }
                logger.info("note updated successfully !")
                res.send({
                    success: true,
                    description: "note updated successfully !",
                    data: data
                });
            });
        } catch (error) {
            if (err.kind === 'ObjectId') {
                logger.error("note not found with id " + req.params.noteId)
                return res.send({
                    success: false,
                    status_code: 404,
                    description: "note not found with id " + req.params.noteId
                });
            }
            logger.error("Error updating note with id " + req.params.noteId)
            return res.send({
                success: false,
                status_code: 500,
                description: "Error updating note with id " + req.params.noteId
            });
        };
    }

    /**
     * @description Update note with id
     * @method delete is service class method
     * @param response is used to send the response 
     */
    delete(req, res) {
        try {
            const noteID = req.params.noteId;
            noteService.delete(noteID, (error, data) => {
                if (error) {
                    logger.warn("note not found with id " + noteID);
                    return res.send({
                        success: false,
                        status_code: 404,
                        description: "note not found with id " + noteID
                    });
                }
                logger.info("note deleted successfully!");
                res.send({
                    success: true,
                    status_code: 200,
                    description: "note deleted successfully!"
                })
            })
        } catch (error) {
            if (error.kind === 'ObjectId' || error.title === 'NotFound') {
                logger.error("could not found note with id" + noteID);
                return res.send({
                    success: false,
                    status_code: 404,
                    description: "note not found with id " + noteID
                });
            }
            logger.error("Could not delete note with id " + noteID);
            return res.send({
                success: false,
                status_code: 500,
                description: "Could not delete note with id " + noteID
            });
        }
    }
}

module.exports = new NoteController();