/**
 * @module        middleware
 * @file          vallidation.js
 * @description   vallidate the user input request
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since         27/01/2021
----------------------------------------------------------------------------------------------------*/
const Joi = require("joi");

const emailIdPattern = Joi.string()
    .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .required();

const passwordPattern = Joi.string()
    .regex(/^[a-zA-Z0-9]{6,16}$/)
    .min(6)
    .required();

const namePattern = Joi.string()
    .regex(/^[a-zA-Z ]+$/)
    .min(3)
    .max(16)
    .required();

module.exports = Joi.object().keys({
    name: namePattern,
    emailId: emailIdPattern,
    password: passwordPattern,
});