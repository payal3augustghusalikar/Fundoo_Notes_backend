/**
 * @module        middleware
 * @file          vallidation.js
 * @description   vallidate the user input request
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since         27/01/2021
----------------------------------------------------------------------------------------------------*/
const Joi = require("joi");

class Valid {
    emailIdPattern = Joi.string()
        .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        .required();

    passwordPattern = Joi.string()
        .regex(/^[a-zA-Z0-9]{6,16}$/)
        .min(6)
        .required();

    namePattern = Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .min(3)
        .max(16)
        .required();

    vallidateName = (name) => {
        console.log("insidename");
        Joi.object().keys({
            name: namePattern,
        });
    };

    vallidateEmail = () => {
        Joi.object().keys({
            emailId: emailIdPattern,
        });
        // Joi.object().keys({
        //     name: namePattern,
        //     emailId: emailIdPattern,
        //     password: passwordPattern,
        // });
    };
}

module.exports = new Valid();