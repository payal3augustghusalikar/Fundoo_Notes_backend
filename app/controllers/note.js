const noteService = require("../services/note.js");
const Joi = require("joi");
const logger = require("../../logger/logger.js");

const ControllerDataValidation = Joi.object({
    title: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .min(3)
        .required(),
    description: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .min(3)
        .required(),
});

class NoteController {
    /**
     * @message Create and save a new note
     * @param res is used to send the response
     */
    create = (req, res) => {
        try {
            const noteInfo = {
                title: req.body.title,
                description: req.body.description,
            };
            const token = req.headers.authorization.split(" ")[1];
            const validation = ControllerDataValidation.validate(noteInfo);
            console.log(validation);
            return validation.error ?
                res.status(400).send({
                    success: false,
                    message: "please enter valid details",
                }) :
                noteService.create(noteInfo, token, (error, data) => {
                    return error ?
                        (logger.error("Some error occurred while creating note"),
                            res.status(500).send({
                                success: false,
                                message: "Some error occurred while creating note " + error,
                            })) //                  logger.info("note added successfully !"),
                        :
                        res.status(200).send({
                            success: true,
                            message: "note added successfully !",
                            data: data,
                        });
                });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Some error occurred while creating note",
            });
        }
    };

    /**
     * @message Find all the note
     * @method findAll is service class method
     */
    findAll = (req, res) => {
        noteService.findAll((error, data) => {
            try {
                return error ?
                    (logger.error("Some error occurred while retrieving notes"),
                        res.send({
                            success: false,
                            status_code: 404,
                            message: `note not found`,
                        })) :
                    (logger.info("Successfully retrieved notes !"),
                        console.log("data in cntr :", data),
                        res.send({
                            success: true,
                            status_code: 200,
                            message: `note found`,
                            data: data,
                        }));
            } catch (error) {
                //             logger.error("note not found");
                res.send({
                    success: false,
                    status_code: 500,
                    message: `note not found`,
                });
            }
        });
    };

    /**
     * @message Find note by id
     * @method findOne is service class method
     * @param response is used to send the response
     */
    findOne = (req, res) => {
        try {
            const noteID = req.params.noteId;
            noteService.findOne(noteID, (error, data) => {
                return (
                    error ?
                    (logger.error("Error retrieving note with id " + noteID),
                        res.status(500).send({
                            success: false,
                            message: "Error retrieving note with id " + noteID,
                        })) :
                    !data ?
                    (logger.warn("Note not found with id : " + noteID),
                        res.status(404).send({
                            success: false,
                            message: "Note not found with id : " + noteID,
                        })) :
                    logger.info("note found with id " + noteID),
                    res.send({
                        success: true,
                        status_code: 200,
                        message: "Note found with id " + noteID,
                        data: data,
                    })
                );
            });
        } catch (error) {
            logger.error("could not found note with id" + req.params.noteID);
            return res.send({
                success: false,
                status_code: 500,
                message: "error retrieving note with id " + req.params.noteID,
            });
        }
    };

    /**
     * @message Find note by labelId
     * @method findOne is service class method
     * @param res is used to send the response
     */
    findNotesByLabelId = (req, res) => {
        try {
            const labelID = req.body.labelId;
            noteService.findNotesByLabel(labelID, (error, data) => {
                return (
                    error ?
                    (logger.error("Error retrieving note with id " + labelID),
                        res.status(500).send({
                            success: false,
                            message: "Error retrieving note with id " + labelID,
                        })) :
                    !data ?
                    (logger.warn("Note not found with id : " + labelID),
                        res.status(404).send({
                            success: false,
                            message: "Note not found with id : " + labelID,
                        })) :
                    logger.info("note found with id " + labelID),
                    res.send({
                        success: true,
                        status_code: 200,
                        message: "Note found with id " + labelID,
                        data: data,
                    })
                );
            });
        } catch (error) {
            logger.error("could not found note with id" + labelID);
            return res.send({
                success: false,
                status_code: 500,
                message: "error retrieving note with id " + labelID,
            });
        }
    };

    /**
     * @message Update note by id
     * @method update is service class method
     * @param res is used to send the response
     */
    update = (req, res) => {
        try {
            const noteInfo = {
                title: req.body.title,
                description: req.body.description,
                noteID: req.params.noteId,
            };
            noteService.update(noteInfo, (error, data) => {
                return (
                    error ?
                    (logger.error(
                            "Error updating note with id : " + req.params.noteId
                        ),
                        res.send({
                            success: false,
                            status_code: 500,
                            message: "Error updating note with id : " + req.params.noteId,
                        })) :
                    !data ?
                    (logger.warn("note not found with id : " + req.params.noteId),
                        res.send({
                            success: false,
                            status_code: 404,
                            message: "note not found with id : " + req.params.noteId,
                        })) :
                    logger.info("note updated successfully !"),
                    res.send({
                        success: true,
                        message: "note updated successfully !",
                        data: data,
                    })
                );
            });
        } catch (error) {
            return (
                err.kind === "ObjectId" ?
                (logger.error("note not found with id " + req.params.noteId),
                    res.send({
                        success: false,
                        status_code: 404,
                        message: "note not found with id " + req.params.noteId,
                    })) :
                logger.error("Error updating note with id " + req.params.noteId),
                res.send({
                    success: false,
                    status_code: 500,
                    message: "Error updating note with id " + req.params.noteId,
                })
            );
        }
    };

    /**
     * @message Update note with id
     * @method delete is service class method
     * @param response is used to send the response
     */
    delete(req, res) {
        try {
            const noteID = req.params.noteId;
            noteService.delete(noteID, (error, data) => {
                return (
                    error ?
                    (logger.warn("note not found with id " + noteID),
                        res.send({
                            success: false,
                            status_code: 404,
                            message: "note not found with id " + noteID,
                        })) :
                    logger.info("note deleted successfully!"),
                    res.send({
                        success: true,
                        status_code: 200,
                        message: "note deleted successfully!",
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.title === "NotFound" ?
                (logger.error("could not found note with id" + noteID),
                    res.send({
                        success: false,
                        status_code: 404,
                        message: "note not found with id " + noteID,
                    })) :
                logger.error("Could not delete note with id " + noteID),
                res.send({
                    success: false,
                    status_code: 500,
                    message: "Could not delete note with id " + noteID,
                })
            );
        }
    }
}

module.exports = new NoteController();