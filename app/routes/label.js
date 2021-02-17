/**
 * @module      routes
 * @file         route.js
 * @description  provide the routes for user as well label operations
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

// var helper = require("../../middleware/helper.js");

// const labels = require("../controllers/label.js");
// const express = require("express");
// var Router = require("router");

// // // let app;
// // /**
// //  * @description Create Router instance

// //  * @typedef {Object} app
// //  */
// // const app = express.Router();

// // var express = require("express");
// // var app = express();

// const app = express();
// const apps = Router();
// app.use(apps);

// // Create a new label
// apps.post("/labels", helper.verifyToken, labels.create);

// // Retrieve all labels
// apps.get("/labels", helper.verifyToken, labels.findAll);

// // Retrieve a single label with labelId
// apps.get("/labels/:labelId", helper.verifyToken, labels.findOne);

// // Retrieve a single label with userId
// apps.get("/labels/:userId", helper.verifyToken, labels.findOneByUserId);

// // Update a label with labelId
// app.put("/labels/:labelId", helper.verifyToken, labels.update);

// // Delete a label with labelId
// apps.delete("/labels/:labelId", helper.verifyToken, labels.delete);

// /**
//  * @description Export Module
//  */
// module.exports = app;

var helper = require("../../middleware/helper.js");

module.exports = (app) => {
    const labels = require("../controllers/label.js");

    // Create a new label
    app.post("/labels", helper.verifyToken, labels.create);

    // Retrieve all labels
    app.get("/labels", helper.verifyToken, labels.findAll);

    // Retrieve a single label with labelId
    app.get("/labels/:labelId", helper.verifyToken, labels.findOne);

    // Retrieve a single label with userId
    app.get("/labels/:userId", helper.verifyToken, labels.findOneByUserId);

    // Update a label with labelId
    app.put("/labels/:labelId", helper.verifyToken, labels.update);

    // Delete a label with labelId
    app.delete("/labels/:labelId", helper.verifyToken, labels.delete);
};