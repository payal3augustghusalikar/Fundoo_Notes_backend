/**
 * @module      routes
 * @file         route.js
 * @description  provide the routes for user as well note operations
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

var helper = require("../../middleware/helper.js");

var redisCache = require("../../middleware/redisCache.js");

module.exports = (app) => {
    const user = require("../controllers/user.js");

    // register a new user
    app.post("/register", user.register);

    // Login existing user
    app.post("/login", user.login);

    //forget password
    app.post("/forgotpassword", user.forgotPassword);

    // Reset password
    app.put("/resetpassword", helper.verifyToken, user.resetPassword);

    //verify Email for registerd user
    app.put("/activateemail", helper.verifyToken, user.activateEmail);
};