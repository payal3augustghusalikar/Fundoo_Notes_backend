const labelServices = require("../services/label.js");
const Joi = require("joi");
const logger = require("../../logger/logger.js");
const status = require("../../middleware/staticFile.json");
let vallidator = require("../../middleware/vallidation.js");

class LabelController {
    /**
     * @message Create and save a new label
     * @param res is used to send the response
     * @param req is used to take user request
     */

    create = (req, res) => {
        try {
            const labelInfo = {
                name: req.body.name,
            };
            const token = req.headers.authorization.split(" ")[1];
            const validation = vallidator.validate(labelInfo);
            return validation.error ?
                res.send({
                    success: false,
                    status: status.Bad_Request,
                    message: "please enter valid details",
                }) :
                labelServices
                .create(labelInfo, token)
                .then((data) => {
                    logger.info("label added successfully !"),
                        res.send({
                            success: true,
                            status: status.Success,
                            message: "label added successfully !",
                            data: data,
                        });
                })
                .catch((error) => {
                    logger.error("Some error occurred while creating label", +error),
                        res.send({
                            success: false,
                            status: status.Internal_Server_Error,
                            message: "Some error occurred while creating label",
                        });
                });
        } catch (error) {
            logger.error("Some error occurred while creating label"),
                res.send({
                    success: false,
                    status: status.Internal_Server_Error,
                    message: "Some error occurred while creating label" + error,
                });
        }
    };

    /**
     * @message Find all the label
     * @method findAll is service class method
     */
    findAll = (req, res) => {
        try {
            var start = new Date();
            const token = req.headers.authorization.split(" ")[1];
            console.log("controlle");
            labelServices
                .findAll(token)
                .then((data) => {
                    logger.info("Successfully retrieved labels !"),
                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: "label of current account has been retrieved",
                            time: (new Date() - start, "ms"),
                            data: data,
                        });

                    console.log("Request took:", new Date() - start, "ms");
                })
                .catch((error) => {
                    logger.error("Some error occurred while retrieving labels"),
                        res.send({
                            success: false,
                            status_code: status.Not_Found,
                            message: "label not found ",
                            error,
                        });
                });
        } catch (error) {
            logger.error("label not found");
            res.send({
                status_code: status.Internal_Server_Error,
                message: "error retriving labels" + error,
            });
        }
    };

    /**
     * @message Find label by id
     * @method findOne is service class method
     * @param response is used to send the response
     */
    findOne = (req, res) => {
        try {
            const labelID = req.params.labelId;
            labelServices
                .findOne(labelID)
                .then((data) => {
                    !data
                        ?
                        (logger.warn("label not found with id : " + labelID),
                            res.send({
                                success: false,
                                Status_code: status.Not_Found,
                                message: "label not found",
                            })) :
                        logger.info("label found with id " + labelID),
                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: "label found",
                            data: data,
                        });
                })
                .catch((error) => {
                    logger.error("Error retrieving label with id " + labelID),
                        res.send({
                            success: false,
                            status_code: status.Internal_Server_Error,
                            message: "label not found",
                        });
                });
        } catch (error) {
            logger.error("could not found label with id" + labelID, +error);
            res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "label not found",
            });
        }
    };

    /**
     * @message Update label by id
     * @method update is service class method
     * @param res is used to send the response
     */
    update = (req, res) => {
        try {
            const labelInfo = {
                name: req.body.name,
                labelID: req.params.labelId,
            };
            labelServices
                .update(labelInfo)
                .then((data) => {
                    !data
                        ?
                        (logger.warn("label not found with id : " + req.params.labelId),
                            res.send({
                                success: false,
                                status_code: status.Not_Found,
                                message: "label not found",
                            })) :
                        logger.info("label updated successfully !"),
                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: "label updated successfully !",
                            data: data,
                        });
                    this.findAll();
                })
                .catch((error) => {
                    logger.error("Error updating label with id : " + req.params.labelId),
                        res.send({
                            success: false,
                            status_code: status.Unauthorized,
                            message: "Error updating label",
                        });
                });
        } catch (error) {
            return (
                error.kind === "ObjectId" ?
                (logger.error("label not found with id " + req.params.labelId),
                    res.send({
                        success: false,
                        status_code: status.Not_Found,
                        message: "label not found ",
                    })) :
                logger.error("Error updating label with id " + req.params.labelId),
                res.send({
                    success: false,
                    status_code: status.Internal_Server_Error,
                    message: "Error updating label",
                })
            );
        }
    };

    /**
     * @message Update label with id
     * @method delete is service class method
     * @param response is used to send the response
     */
    delete = async(req, res) => {
        try {
            const labelID = req.params.labelId;
            let data = await labelServices.delete(labelID);
            !data
                ?
                (logger.warn("label not found with id " + labelID),
                    res.send({
                        success: false,
                        status_code: status.Not_Found,
                        message: "label not found with id ",
                    })) :
                res.send({
                    success: true,
                    status_code: status.Success,
                    message: "label deleted successfully!",
                });
            error(
                logger.warn("label not found with id" + labelID),
                res.send({
                    success: false,
                    status_code: status.Not_Found,
                    message: "label not found with id",
                })
            );
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.name === "NotFound" ?
                (logger.error("could not found label with id" + labelID),
                    res.send({
                        success: false,
                        status_code: status.Not_Found,
                        message: "label not found with id",
                    })) :
                logger.error("Could not delete label with id" + error + labelID),
                res.send({
                    success: false,
                    status_code: status.Internal_Server_Error,
                    message: "Could not delete label with id",
                })
            );
        }
    };
}

module.exports = new LabelController();