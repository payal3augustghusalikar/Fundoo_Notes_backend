/**
 * @module       app
 * @file         server.js
 * @description  connecting to server and rendering all routes
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------*/

const express = require("express");
const bodyParser = require("body-parser");
require("./config/mongoDB.js")();
const config = require("./config").get();
//const logger = require("../../logger/logger.js");

require("dotenv").config();

// create express app
const app = express();
require("./config").set(process.env.NODE_ENV, app);
console.log("server : " + process.env.NODE_ENV);
console.log(app);

//const router = require('./server/routes');
//const config = require("./config").get();

/**
 * @description Winston logger derived from the config
 */
const { logger } = config;

console.log(config);

//const config = require("./config").get();

//require("./config").set(process.env.NODE_ENV, app);

console.log("server1 : " + config);

//const config = require("../config").get();
//const { logger } = config;

/**
 * @description require swagger-ui and swagger.json
 */
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./lib/swagger.json");

/**
 * @description Winston logger derived from the config
 */
//const { logger } = config;

//set express view engine
app.set("view engine", "ejs");

// parse requests of content-type - application/x-www-form-urlencoded - extended is a key
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

//const logger = require("./logger/logger.js");

// define a simple route and data in json format
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FundooNotes Application. " });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Require Notes routes
require("./app/routes/route.js")(app);

//const port = process.env.PORT || 2001;
//const port = config.port || 2001;
// listen for requests using callback
app.listen(config.port, () => {
  logger.info(`Server is listening on port: ${config.port}`);
});

module.exports = app;
