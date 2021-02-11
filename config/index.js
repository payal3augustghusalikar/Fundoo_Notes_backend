/**
 * @file index.js
 *
 * @description Index Configuration setup is required to run your server.
 *
 * @author  Payal <payal.ghusalikar9@gmail.com>
 -----------------------------------------------------------------------------------------------*/
require('dotenv').config();
const cors = require('cors');
const express = require('express');


let config;

/**
 * @description Combine all the require config files.
 */
const envConfig = {
    production() {
        return require('./production')
            // (winstonConfig);
    },
    development() {
        return require('./development')
            //(winstonConfig);
    },
};


/**
 * @description It return true if the current system is production
 * @param {*} config
 */
const isProduction = config => {
    return config.name == 'production';
};

/**
 * @description It return true if the current system is production
 * @param {*} config
 */

const isDevelopement = config => {
    return config.name == 'development';
};


/**
 * @description Return the domain URI
 * @param {*} that is configuration
 */
const getDomainURL = that => {
    this.host = that.config.host;
    this.port = that.config.port;
    if (that.config.isProduction || that.config.isDevelopement) {
        return this.host;
    }
    return `${this.host}:${this.port}`;
};



// /**
//  * @description Configuration getting for the site
//  * @params {Object} config
//  */
// getConfig: () => this._config,

//     /**
//      * @description Configuration setting for the site
//      * @params {Object} config
//      */
//     setConfig: config => {
//         this._config = config;
//     },


/**
 * @description Set the config.
 * @param {Object} obj
 */
const setConfig = obj => {
    config = obj;
};

/**
 * @description Return the config.
 */
const getConfig = () => config;



/**
 * @exports : Exports the Config Environment based Configuration
 */
module.exports = {
    /**
     * @description Setting the site configuration. Loading of the server starts here.
     * @function {function} attach will wrap all configuration environment specific data,
     * 			Domain URL, Redis, Mailer, AWS & logger
     * @param {string} env Environment will state the environment to laod e.g.
     * for production server it will be `production`
     */
    set: (
        /**
         * @description env argument for initializing the environment specific configuration
         * @const {string} env : Environment varibale name
         */
        env,

        /**
         * @description loading the Environment configuration.
         * @const{string} _app Express application instance
         */
        _app
    ) => {
        if (config == null) {
            // console.log("condfsdf")
            /**
             * @description loading the Environment configuration if env varialble is set
             * otherwise load the local configuration.
             */
            this.config = typeof envConfig[env] !== 'undefined' ? envConfig[env]() : envConfig.local();

            /**
             * @description Express application instance.
             */
            this.config.app = _app;

            /**
		 * @description Allowed domains require the file which has the list of domains.
		 *
		 * @const{Object} this.config.subdomains set to the list of array list of subdomains
		 return 			 */
            // this.config.subdomainConfig = require("./static/subdomain");

            /**
             * @description Verify & check if its production server.
             * isProduction(this.config) passing the loadded configuration to the function
             * to get if it's production or not.
             * @const{Object} this.config.isProduction is set to Boolean `true`
             */
            this.config.isProduction = isProduction(this.config);


            /**
             * @description Verify & check if it's stage server.
             * isStage(this.config) passing the loadded configuration to the function to get if it's stage or not.
             * @const{Object} this.config.isStage is set to Boolean `true`
             */
            this.config.isDevelopement = isDevelopement(this.config);


            /**
             * @description Environment name `ename`, Setting the ename will know which environment is loaded.
             */
            this.ename = this.config.name ? this.config.name : '';

            /**
             * @description Static content through-out the site.
             * @const{Object} staticContent
             */
            // this.config.staticContent = staticContent;

        }

        setConfig(config);
        return config;
    },
    get: () => getConfig(),
    config,
};