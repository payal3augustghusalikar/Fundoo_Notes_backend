/**
 * @module       app
 * @file         server.js
 * @description  connecting to server and rendering all routes
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------*/

const express = require('express');
const bodyParser = require('body-parser');
require('./config/mongoDB.js')();

/**
 * @description require swagger-ui and swagger.json
 */
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./lib/swagger.json')

// create express app
const app = express();
//app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded - extended is a key
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json 
app.use(bodyParser.json())

const logger = require('./logger/logger.js');

// define a simple route and data in json format
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to FundooNotes Application. " });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Require Notes routes  
require('./app/routes/route.js')(app);

const port = process.env.PORT || 2001;
// listen for requests using callback
app.listen(port, () => {
    logger.info(`Server is listening on port: ${port}`);
});

module.exports = app;