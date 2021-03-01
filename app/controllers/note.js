const noteService = require("../services/note.js");
const Joi = require("joi");
const logger = require("../../logger/logger.js");
const status = require("../../middleware/staticFile.json");
const { Console } = require("winston/lib/winston/transports");

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
                            res.send({
                                success: false,
                                status_code: status.Internal_Server_Error,
                                message: "Some error occurred while creating note",
                            })) //                  logger.info("note added successfully !"),
                        :
                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: "note added successfully !",
                            data: data,
                        });
                });
        } catch (error) {
            res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "Some error occurred while creating note",
            });
        }
    };

    /**
     * @message Find all the note
     * @method findAll is service class method
     */
    findAll = (req, res) => {
        try {
            var start = new Date();
            const token = req.headers.authorization.split(" ")[1];
            noteService.findAll(token, (error, data) => {
                return error ?
                    (logger.error("Some error occurred while retrieving notes"),
                        res.send({
                            success: false,
                            status_code: status.Not_Found,
                            message: `note not found`,
                        })) :
                    (logger.info("Successfully retrieved notes !"),
                        //  console.log("data in cntr :", data),
                        console.log("Request took:", new Date() - start, "ms"),
                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: `note found`,
                            data: data,
                        }));
            });
            console.log("Request took:", new Date() - start, "ms");
        } catch (error) {
            //             logger.error("note not found");
            res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: `note not found`,
            });
        }
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
                        res.send({
                            success: false,
                            status_code: status.Internal_Server_Error,
                            message: "Error retrieving note with id " + noteID,
                        })) :
                    !data ?
                    (logger.warn("Note not found with id : " + noteID),
                        res.send({
                            success: false,
                            status_code: status.Not_Found,
                            message: "Note not found with id : " + noteID,
                        })) :
                    logger.info("note found with id " + noteID),
                    res.send({
                        success: true,
                        status_code: status.Success,
                        message: "Note found with id " + noteID,
                        data: data,
                    })
                );
            });
        } catch (error) {
            logger.error("could not found note with id" + req.params.noteID);
            return res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "error retrieving note with id " + req.params.noteID,
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
                    (logger.error("Error updating note with id : " + noteID),
                        res.send({
                            status_code: status.Internal_Server_Error,
                            message: "Error updating note with id : " + noteID,
                        })) :
                    !data ?
                    (logger.warn("note not found with id : " + noteID),
                        res.send({
                            status_code: status.Not_Found,
                            message: "note not found with id : " + noteID,
                        })) :
                    logger.info("note updated successfully !"),
                    res.send({
                        message: "note updated successfully !",
                        data: data,
                    })
                    // console.log("calling find all"),
                    // this.findAll()
                );
            });
        } catch (error) {
            return (
                err.kind === "ObjectId" ?
                (logger.error("note not found with id " + noteID),
                    res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + noteID,
                    })) :
                logger.error("Error updating note with id " + noteID),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Error updating note with id " + noteID,
                })
            );
        }
    };

    /**
     * @message delete note with id
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
                            status_code: status.Not_Found,
                            message: "note not found with id " + noteID,
                        })) :
                    logger.info("note deleted successfully!"),
                    res.send({
                        status_code: status.Success,
                        message: "note deleted successfully!",
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.title === "NotFound" ?
                (logger.error("could not found note with id" + noteID),
                    res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + noteID,
                    })) :
                logger.error("Could not delete note with id " + noteID),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Could not delete note with id " + noteID,
                })
            );
        }
    }

    /**
     * @message add collaborator note by id
     * @method update is service class method
     * @param res is used to send the response
     */
    addcollaboratorToNote = (req, res) => {
        console.log("controller");
        try {
            const noteInfoWithcollaboratorId = {
                noteID: req.params.noteId,
                collaboratorId: req.body.collaboratorId,
            };
            noteService.addcollaboratorToNotes(
                noteInfoWithcollaboratorId,
                (error, data) => {
                    return (
                        error ?
                        (logger.error(
                                "Error updating note with id : " + req.params.noteId + error
                            ),
                            res.send({
                                success: false,
                                status_code: status.Internal_Server_Error,
                                message: "Error updating note with id : " +
                                    req.params.noteId +
                                    error,
                            })) :
                        !data ?
                        (logger.warn("note not found with id : " + req.params.noteId),
                            res.send({
                                success: false,
                                status_code: status.Not_Found,
                                message: "note not found with id : " + req.params.noteId + error,
                            })) :
                        logger.info("collaborator added to note successfully !"),
                        res.send({
                            success: true,
                            message: "collaborator added to note successfully ! !" + error,
                            data: data,
                        })
                    );
                }
            );
        } catch (error) {
            return (
                error.kind === "ObjectId" ?
                (logger.error(
                        "note not found with id " + error + req.params.noteId
                    ),
                    res.send({
                        success: false,
                        status_code: status.Not_Found,
                        message: "note not found with id " + error + req.params.noteId,
                    })) :
                logger.error(
                    "Error updating note with id " + error + req.params.noteId
                ),
                res.send({
                    success: false,
                    status_code: status.Internal_Server_Error,
                    message: "Error updating note with id " + error + req.params.noteId,
                })
            );
        }
    };

    /**
     * @message delete note with id
     * @method delete is service class method
     * @param response is used to send the response
     */
    removecollaboratorfromnote(req, res) {
        try {
            const noteInfoWithcollaboratorId = {
                noteID: req.params.noteId,
                collaboratorId: req.body.collaboratorId,
            };
            noteService.removecollaborator(
                noteInfoWithcollaboratorId,
                (error, data) => {
                    return (
                        error ?
                        (logger.warn(
                                "collaborator not found with id " + req.params.collaboratorId
                            ),
                            res.send({
                                status_code: status.Not_Found,
                                message: "collaborator not found with id " +
                                    req.params.collaboratorId,
                            })) :
                        logger.info("collaborator deleted successfully!"),
                        res.send({
                            status_code: status.Success,
                            message: "collaborator deleted successfully!",
                        })
                    );
                }
            );
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.title === "NotFound" ?
                (logger.error(
                        "could not found note with id" + req.params.collaboratorId
                    ),
                    res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + req.params.collaboratorId,
                    })) :
                logger.error(
                    "Could not delete collaborator with id " +
                    req.params.collaboratorId
                ),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Could not delete collaborator with id " +
                        req.params.collaboratorId,
                })
            );
        }
    }

    /**
     * @message delete note with id
     * @method delete is service class method
     * @param response is used to send the response
     */
    deleteForever(req, res) {
        try {
            const noteID = req.params.noteId;
            noteService.deleteNote(noteID, (error, data) => {
                return (
                    error ?
                    (logger.warn("note not found with id " + noteID),
                        res.send({
                            status_code: status.Not_Found,
                            message: "note not found with id " + noteID,
                        })) :
                    logger.info("note permentely deleted successfully!"),
                    res.send({
                        status_code: status.Success,
                        message: "note permentely deleted successfully!",
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.title === "NotFound" ?
                (logger.error("could not found note with id" + noteID),
                    res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + noteID,
                    })) :
                logger.error("Could not delete note with id " + noteID),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Could not delete note with id " + noteID,
                })
            );
        }
    }

    /**
     * @message delete note with id
     * @method delete is service class method
     * @param response is used to send the response
     */
    deleteNote(req, res) {
        try {
            const noteID = req.params.noteId;
            noteService.removeNote(noteID, (error, data) => {
                return (
                    error ?
                    (logger.warn("note not found with id " + noteID),
                        res.send({
                            status_code: status.Not_Found,
                            message: "note not found with id " + noteID,
                        })) :
                    logger.info("note deleted successfully!"),
                    res.send({
                        status_code: status.Success,
                        message: "note deleted successfully!",
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.title === "NotFound" ?
                (logger.error("could not found note with id" + noteID),
                    res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + noteID,
                    })) :
                logger.error("Could not delete note with id " + noteID),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Could not delete note with id " + noteID,
                })
            );
        }
    }

    /**
     * @message Create and save a new note
     * @param res is used to send the response
     */
    addCollaborator = (req, res) => {
        console.log("ctrl");
        try {
            const collaborator = {
                noteId: req.params.noteId,
                collaboratorId: req.body.collaboratorId,
            };
            console.log(collaborator.collaboratorId);
            const token = req.headers.authorization.split(" ")[1];
            noteService
                .createCollaborator(collaborator)
                .then((data) => {
                    res.send({
                        success: true,
                        status: status.Success,
                        message: "collaborator added successfully !",
                        data: data,
                    });
                })
                .catch((error) => {
                    res.send({
                        success: false,
                        status: status.Internal_Server_Error,
                        message: "Some error occurred while creating collaborator" + error,
                    });
                });
        } catch (error) {
            logger.error("Some error occurred while creating collaborator"),
                res.send({
                    success: false,
                    status: status.Internal_Server_Error,
                    message: "Some error occurred while creating collaborator" + error,
                });
        }
    };

    //     try {
    //         const collaborator = {
    //             noteID: req.params.noteId,
    //             collaboratorId: req.body.userId,
    //         };
    //         const token = req.headers.authorization.split(" ")[1];
    //         // const validation = ControllerDataValidation.validate(noteInfo);
    //         // console.log(validation);
    //         // return validation.error ?
    //         //     res.status(400).send({
    //         //         success: false,
    //         //         message: "please enter valid details",
    //         //     }) :
    //         noteService.createCollaborator(collaborator, token, (error, data) => {
    //             return error ?
    //                 (logger.error("Some error occurred while creating collaborator"),
    //                     res.send({
    //                         success: false,
    //                         status_code: status.Internal_Server_Error,
    //                         message: "Some error occurred while creating collaborator",
    //                     })) //                  logger.info("note added successfully !"),
    //                 :
    //                 res.send({
    //                     success: true,
    //                     status_code: status.Success,
    //                     message: "collaborator added successfully !",
    //                     data: data,
    //                 });
    //         });
    //     } catch (error) {
    //         res.send({
    //             success: false,
    //             status_code: status.Internal_Server_Error,
    //             message: "Some error occurred while creating collaborator",
    //         });
    //     }
    // };
}

module.exports = new NoteController();