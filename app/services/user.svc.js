const User = require('../models/user.mdl.js');

class userService {
    /**
     * @description register and save User then send response to controller
     * @method register is used to save the User
     * @param callback is the callback for controller
     */


    register = (userInfo, callback) => {
        // register a User
        User.register(userInfo, (error, data) => {
            if (error)
                return callback(error, null);
            return callback(null, data);
        })
    }


    /**
     * @description Find all the Users and return response to controller
     * @method findAll is used to retrieve Users
     * @param callback is the callback for controller
     */
    findAll = (callback) => {
        User.findAll((error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    /**
     * @description Find User by id and return response to controller
     * @method login is used to retrieve User by ID
     * @param callback is the callback for controller
     */
    login = (userLoginInfo, callback) => {
        User.login(userLoginInfo, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    /**
     * @description Update User by id and return response to controller
     * @method update is used to update User by ID
     * @param callback is the callback for controller
     */
    update = (userInfo, callback) => {
        User.update(userInfo, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }


    /**
     * @description Delete User by id and return response to controller
     * @method deleteById is used to remove User by ID
     * @param callback is the callback for controller
     */
    delete = (userLoginInfo, callback) => {
        User.deleteById(userLoginInfo, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }
}

module.exports = new userService();