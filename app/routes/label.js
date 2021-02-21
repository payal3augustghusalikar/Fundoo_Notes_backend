/**
 * @module      routes
 * @file         route.js
 * @description  provide the routes for user as well label operations
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

var helper = require("../../middleware/helper.js");
var redisCache = require("../../middleware/redisCache.js");

module.exports = (app) => {
    const labels = require("../controllers/label.js");

    // Create a new label
    app.post("/labels", helper.verifyToken, labels.create);

    // Retrieve all labels
    app.get("/labels", helper.verifyToken, redisCache.redisGet, labels.findAll);

    // Retrieve a single label with labelId
    app.get("/labels/:labelId", helper.verifyToken, labels.findOne);

    // Update a label with labelId
    app.put("/labels/:labelId", helper.verifyToken, labels.update);

    // Delete a label with labelId
    app.delete("/labels/:labelId", helper.verifyToken, labels.delete);
};