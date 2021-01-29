require(`dotenv`).config()

'use strict';

var DEBUG_CONNECTING = 'Connecting to db server %s...';
var DEBUG_ALREADY_CONNECTED = 'Already connected to db server %s.';
var DEBUG_ALREADY_CONNECTING = 'Already connecting to db server %s.';
var DEBUG_CONNECTED = 'Successfully connected to db server %s.';
var DEBUG_CONNECTION_ERROR = 'An error has occured while connecting to db server %s.';
var blueBird = require('bluebird');
var mongoose = require('mongoose');
var debug = require('debug');
var d = debug('mongo-db-instance');
var isState = function(state) {
    return mongoose.connection.readyState === mongoose.Connection.STATES[state];
};

/**
 * @constructor
 * @param {string} uri     - Mongoose connection URI.
 * @see http://mongoosejs.com/docs/connections.html
 * @param {object} options - Mongoose connection options.
 */
function MongoDBAdapter(uri, options) {
    this.uri = uri;
    this.options = options;
}

/**
 * @description Add connection listeners without adding more than one for each event.
 * This is done to avoid:
 *   'warning: possible EventEmitter memory leak detected. 11 listeners added'
 * More info: https://github.com/joyent/node/issues/5108
 */
MongoDBAdapter.prototype.addConnectionListener = function(event, cb) {
    var listeners = mongoose.connection.on;
    if (!listeners || !listeners[event] || listeners[event].length === 0) {
        mongoose.connection.once(event, cb.bind(this));
    }
};

/**
 * @description Returns a promise that gets resolved when successfully connected to MongoDB URI, or rejected otherwise.
 * @returns {Promise} Returns promise
 */
MongoDBAdapter.prototype.connect = function() {
    return new blueBird(function(resolve, reject) {
        if (isState('connected')) {
            d(DEBUG_ALREADY_CONNECTED, this.uri);
            return resolve(this.uri);
        }
        this.addConnectionListener('error', function(err) {
            d(DEBUG_CONNECTION_ERROR, this.uri);
            return reject(err);
        });
        this.addConnectionListener('open', function() {
            d(DEBUG_CONNECTED, this.uri);
            return resolve(this.uri);
        });
        if (isState('connecting')) {
            d(DEBUG_ALREADY_CONNECTING, this.uri);
        } else {
            d(DEBUG_CONNECTING, this.uri);
            mongoose.connect(this.uri, this.options);
        }
    }.bind(this));
};

const uri = process.env.MONGODB_URL;

var mongoDBAdapter = new MongoDBAdapter(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
        //mongoose.set('useCreateIndex', true)
});
mongoDBAdapter.connect()
    .then(uri =>
        console.log("Connected to " + uri))
    .catch(err =>
        console.log("Could not connect database", err));



module.exports = MongoDBAdapter;