/* @module        controller
 * @file          note.js
 * @description  controllers takes request and send the response   
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since         26/01/2021  
-----------------------------------------------------------------------------------------------*/
const noteService = require("../services/note.js");
const Joi = require("joi");
const logger = require("../../logger/logger.js");
const status = require("../../middleware/staticFile.json");

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
     * @description create anew note
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
                            })) :

                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: "note added successfully !",
                            data: data,

                        });


                });

        } catch (error) {
            return res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "Some error occurred while creating note",
            });
        }
    };

    /**
     * @description find all notes from db
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
                        console.log("data"),
                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: `note found`,
                            data: data,
                        }));
            });
        } catch (error) {
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
        console.log("update")
        try {
            const noteInfo = {
                title: req.body.title,
                description: req.body.description,
                noteID: req.params.noteId,
            };
            const token = req.headers.authorization.split(" ")[1];
            console.log("req.params.noteId", req.params.noteId)
            const noteData = {
                title: noteInfo.title,
                description: noteInfo.description,
            };
            const validation = ControllerDataValidation.validate(noteData);
            return validation.error ?
                res.status(400).send({
                    success: false,
                    message: "please enter valid details " + validation.error,
                }) :
                noteService.update(noteInfo, token, (error, data) => {
                    return (
                        error ?
                        (logger.error("Error updating note with id : " + req.params.noteId),
                            res.send({
                                status_code: status.Internal_Server_Error,
                                message: "Error updating note with id : " + req.params.noteId,
                            })) :
                        !data ?
                        (logger.warn("note not found with id : " + req.params.noteId),
                            res.send({
                                status_code: status.Not_Found,
                                message: "note not found with id : " + req.params.noteId,
                            })) :
                        logger.info("note updated successfully !"),
                        console.log("data : ", data),
                        res.send({
                            status_code: status.Success,
                            message: "note updated successfully !",
                            data: data,
                        })
                    );
                });
        } catch (error) {
            return (
                error.kind === "ObjectId" ?
                (logger.error("note not found with id " + req.params.noteId),
                    res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + req.params.noteId,
                    })) :
                logger.error("Error updating note with id " + req.params.noteId),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Error updating note with id " + req.params.noteId,
                })
            );
        }
    };

    // /**
    //  * @message softdelete note with id by setting isdeleted value true
    //  * @method delete is service class method
    //  * @param response is used to send the response
    //  */
    // delete(req, res) {
    //     console.log("delete ctrl")
    //     try {
    //         const noteID = req.params.noteId;
    //         return noteService.delete(noteID, (error, data) => {
    //             return (
    //                 error ?
    //                 (logger.warn("note not found with id " + noteID),
    //                     res.send({
    //                         status_code: status.Not_Found,
    //                         message: "note not found with id " + noteID,
    //                     })) :
    //                 logger.info("note deleted successfully!"),
    //                 res.send({
    //                     status_code: status.Success,
    //                     message: "note deleted successfully!",
    //                 })
    //             );
    //         });
    //     } catch (error) {
    //         return (
    //             error.kind === "ObjectId" || error.title === "NotFound" ?
    //             (logger.error("could not found note with id" + noteID),
    //                 res.send({
    //                     status_code: status.Not_Found,
    //                     message: "note not found with id " + noteID,
    //                 })) :
    //             logger.error("Could not delete note with id " + noteID),
    //             res.send({
    //                 status_code: status.Internal_Server_Error,
    //                 message: "Could not delete note with id " + noteID,
    //             })
    //         );
    //     }
    // }


    /**
     * @message restoreNote  with id
     * @method delete is service class method
     * @param response is used to send the response
     */
    restoreNote(req, res) {

        try {
            const noteID = req.params.noteId;
            const token = req.headers.authorization.split(" ")[1];
            return noteService.restore(noteID, token, (error, data) => {
                return (
                    error ?
                    (logger.warn("note not found with id " + noteID),
                        res.send({
                            status_code: status.Not_Found,
                            message: "note not found with id " + noteID,
                        })) :
                    logger.info("note restore successfully!"),
                    res.send({
                        status_code: status.Success,
                        message: "note restore successfully!",
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
                logger.error("Could not restore note with id " + noteID),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Could not restore note with id " + noteID,
                })
            );
        }
    }








    /**
     * @message add label note by id
     * @method addLabelToNotes is service class method
     * @param res is used to send the response
     */
    addLabelToNote = (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const noteInfoWithLabelId = {
                noteID: req.params.noteId,
                labelId: req.body.labelId,
            };
            noteService.addLabelToNotes(noteInfoWithLabelId, token, (error, data) => {
                return (
                    error ?
                    (logger.error(
                            "Error updating note with id : " + req.params.noteId + error
                        ),
                        res.send({
                            success: false,
                            status_code: status.Internal_Server_Error,
                            message: "Error updating note with id : " + req.params.noteId + error,
                        })) :
                    !data ?
                    (logger.warn("note not found with id : " + req.params.noteId),
                        res.send({
                            success: false,
                            status_code: status.Not_Found,
                            message: "note not found with id : " + req.params.noteId + error,
                        })) :
                    logger.info("Label added to note successfully !"),
                    res.send({
                        success: true,
                        message: "Label added to note successfully ! !" + error,
                        data: data,
                    })
                );
            });
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
     * @message delete label with id
     * @method removeLabel is service class method
     * @param response is used to send the response
     */
    removelabelfromnote(req, res) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const noteInfoWithLabelId = {
                noteID: req.params.noteId,
                labelId: req.body.labelId,
            };
            noteService.removeLabel(noteInfoWithLabelId, token, (error, data) => {
                return (
                    error ?
                    (logger.warn("Label not found with id " + req.params.labelId),
                        res.send({
                            status_code: status.Not_Found,
                            message: "Label not found with id " + req.params.labelId,
                        })) :
                    logger.info("Label deleted successfully!"),
                    res.send({
                        status_code: status.Success,
                        message: "Label deleted successfully!",
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.title === "NotFound" ?
                (logger.error("could not found note with id" + req.params.labelId),
                    res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + req.params.labelId,
                    })) :
                logger.error(
                    "Could not delete Label with id " + req.params.labelId
                ),
                res.send({
                    status_code: status.Internal_Server_Error,
                    message: "Could not delete Label with id " + req.params.labelId,
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
            console.log("delete ctrl")
            const token = req.headers.authorization.split(" ")[1];
            const noteID = req.params.noteId;
            return noteService.deleteNote(noteID, token, (error, data) => {
                if (error)

                //(logger.warn("note not found with id " + noteID),
                    return res.send({
                        status_code: status.Not_Found,
                        message: "note not found with id " + noteID,
                    })
                    //  ) 
                else
                //  logger.info("note permentely deleted successfully!"),
                    return res.send({
                    status_code: status.Success,
                    message: "note permentely deleted successfully!",
                })

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
     * @message delete note with id whitch is setting isDeleted value true(softdelete)
     * @method removeNote is service class method
     * @param response is used to send the response
     */
    deleteNote(req, res) {
        try {

            const noteID = req.params.noteId;
            const token = req.headers.authorization.split(" ")[1];
            return noteService.removeNote(noteID, token, (error, data) => {
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
     * @description adds the new uer to notes
     *@param req holds the id
     * @param res is used to send the response
     */
    addCollaborator = (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const collaborator = {
                noteId: req.params.noteId,
                collaboratorId: req.body.collaboratorId,
            };
            noteService
                .createCollaborator(collaborator, token)
                .then((data) => {
                    if (!data) {
                        res.send({
                            success: false,
                            status_code: status.Not_Found,
                            message: "note not found with id : " + req.params.noteId + error,
                        });
                    }
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

    /**
     * @description delete colloaborator from note
     * @method noteService.removeCollaborator is service class method
     * @param req holds id
     * @param res sends the responce
     */
    removeCollaborator = (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const collaboratorData = {
                noteId: req.params.noteId,
                collaboratorId: req.body.collaboratorId,
            };
            noteService
                .removeCollaborator(collaboratorData, token)
                .then((data) => {
                    res.send({
                        success: true,
                        status: status.Success,
                        message: "collaborator remove successfully !",
                        data: data,
                    });
                })
                .catch((error) => {
                    res.send({
                        success: false,
                        status: status.Internal_Server_Error,
                        message: "Some error occurred while removing collaborator" + error,
                    });
                });
        } catch (error) {
            res.send({
                success: false,
                status: status.Internal_Server_Error,
                message: "Some error occurred while removing collaborator" + error,
            });
        }
    };
}

module.exports = new NoteController();