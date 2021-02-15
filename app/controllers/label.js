const labelServices = require("../services/label.js");
const Joi = require("joi");
const logger = require("../../logger/logger.js");
//const Status = require("./middleware/statusCode.json")
const Status = require("../../middleware/statusCode.json");
//const Status = require("../../../middleware/statusCode.json");
const ControllerDataValidation = Joi.object({
    name: Joi.string()
        .regex(/^[a-zA-Z0-1]+$/)
        .min(3)
        .required(),
});

class LabelController {
    /**
     * @description Create and save a new label
     * @param res is used to send the response
     */
    create = (req, res) => {
        const labelInfo = {
            name: req.body.name,
        };
        const token = req.headers.authorization.split(" ")[1];
        const validation = ControllerDataValidation.validate(labelInfo);
        return validation.error ?
            res.send({
                success: false,
                status: Status.Bad_Request,
                description: "please enter valid details",
            }) :
            labelServices.create(labelInfo, token, (error, data) => {
                return (
                    error ?
                    (logger.error("Some error occurred while creating label"),
                        res.send({
                            success: false,
                            status: Status.Internal_Server_Error,
                            description: "Some error occurred while creating label",
                        })) :
                    logger.info("label added successfully !"),
                    res.send({
                        success: true,
                        status: Status.Success,
                        description: "label added successfully !",
                        data: data,
                    })
                );
            });
    };

    /**
     * @description Find all the label
     * @method findAll is service class method
     */
    findAll = (req, res) => {
        labelServices.findAll((error, data) => {
            try {
                return error ?
                    (logger.error("Some error occurred while retrieving labels"),
                        res.send({
                            success: false,
                            status_code: 404,
                            description: `label not found`,
                        })) :
                    (logger.info("Successfully retrieved labels !"),
                        res.send({
                            success: true,
                            status_code: 200,
                            description: `label found`,
                            data: data,
                        }));
            } catch (error) {
                logger.error("label not found");
                res.send({
                    success: false,
                    status_code: 500,
                    description: `label not found`,
                });
            }
        });
    };

    /**
     * @description Find label by id
     * @method findOne is service class method
     * @param response is used to send the response
     */
    findOne = (req, res) => {
        try {
            const labelID = req.params.labelId;
            labelServices.findOne(labelID, (error, data) => {
                return (
                    error ?
                    (logger.error("Error retrieving label with id " + labelID),
                        res.status(500).send({
                            success: false,
                            description: "Error retrieving label with id " + labelID,
                        })) :
                    !data ?
                    (logger.warn("label not found with id : " + labelID),
                        res.status(404).send({
                            success: false,
                            description: "label not found with id : " + labelID,
                        })) :
                    logger.info("label found with id " + labelID),
                    res.send({
                        success: true,
                        status_code: 200,
                        description: "label found with id " + labelID,
                        data: data,
                    })
                );
            });
        } catch (error) {
            logger.error("could not found label with id" + req.params.labelID);
            return res.send({
                success: false,
                status_code: 500,
                description: "error retrieving label with id " + req.params.labelID,
            });
        }
    };

    /**
     * @description Update label by id
     * @method update is service class method
     * @param res is used to send the response
     */
    update = (req, res) => {
        try {
            const labelInfo = {
                name: req.body.name,
                description: req.body.description,
                labelID: req.params.labelId,
            };
            labelServices.update(labelInfo, (error, data) => {
                return (
                    error ?
                    (logger.error(
                            "Error updating label with id : " + req.params.labelId
                        ),
                        res.send({
                            success: false,
                            status_code: 500,
                            description: "Error updating label with id : " + req.params.labelId,
                        })) :
                    !data ?
                    (logger.warn("label not found with id : " + req.params.labelId),
                        res.send({
                            success: false,
                            status_code: 404,
                            description: "label not found with id : " + req.params.labelId,
                        })) :
                    logger.info("label updated successfully !"),
                    res.send({
                        success: true,
                        description: "label updated successfully !",
                        data: data,
                    })
                );
            });
        } catch (error) {
            return (
                err.kind === "ObjectId" ?
                (logger.error("label not found with id " + req.params.labelId),
                    res.send({
                        success: false,
                        status_code: 404,
                        description: "label not found with id " + req.params.labelId,
                    })) :
                logger.error("Error updating label with id " + req.params.labelId),
                res.send({
                    success: false,
                    status_code: 500,
                    description: "Error updating label with id " + req.params.labelId,
                })
            );
        }
    };

    /**
     * @description Update label with id
     * @method delete is service class method
     * @param response is used to send the response
     */
    delete(req, res) {
        try {
            const labelID = req.params.labelId;
            labelServices.delete(labelID, (error, data) => {
                return (
                    error ?
                    (logger.warn("label not found with id " + labelID),
                        res.send({
                            success: false,
                            status_code: 404,
                            description: "label not found with id " + labelID,
                        })) :
                    logger.info("label deleted successfully!"),
                    res.send({
                        success: true,
                        status_code: 200,
                        description: "label deleted successfully!",
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.name === "NotFound" ?
                (logger.error("could not found label with id" + labelID),
                    res.send({
                        success: false,
                        status_code: 404,
                        description: "label not found with id " + labelID,
                    })) :
                logger.error("Could not delete label with id " + labelID),
                res.send({
                    success: false,
                    status_code: 500,
                    description: "Could not delete label with id " + labelID,
                })
            );
        }
    }
}

module.exports = new LabelController();