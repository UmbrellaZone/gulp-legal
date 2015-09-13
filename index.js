/// <reference path="typings/tsd.d.ts" />
var path, through;
var https = require("https");
through = require("through2");
path = require("path");
module.exports = function (options, mojo) {
    /* -------------------------------------------------------------------------
    ------------------------- helper functions ----------------------------------
    --------------------------------------------------------------------------
    */
    if (mojo === void 0) { mojo = undefined; }
    if (mojo != undefined) {
        mojo.log("now prepocessing blog");
    }
    else {
        console.log('you do not seem to use mojo.io');
        mojo = {};
        mojo.log = function (logthis) {
            console.log(logthis);
        };
    }
    /*--------------------------------------------------------------------------
    ---------------------- returned stream --------------------------------------
    --------------------------------------------------------------------------
    */
    return through.obj(function (file, enc, cb) {
        if (file.isNull() === true) {
            cb(null, file);
            return;
        }
        if (file.isStream()) {
            mojo.log("streaming not supported");
            return;
        }
        /* ------------------------------------------------------------------------------------
       ------------ create umbrella object ----------------------------------------------------
       ------------------------------------------------------------------------------------ */
        var umbrella = {};
        //get the jade Template from GitHub
        var request = require('request');
        request.get('https://raw.githubusercontent.com/UmbrellaZone/umbrella-legal/master/00dev/jade/index.jade', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                umbrella.jadeTemplate = body;
            }
            else {
                console.log('could not get jade template for the umbrella.zone imprint');
            }
            ;
        });
        //get the legal.json file
        request.get('https://raw.githubusercontent.com/UmbrellaZone/umbrella-legal/master/01build/content.json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                umbrella.legalJson = body;
            }
            else {
                console.log('could not get jade template for the umbrella.zone imprint');
            }
            ;
        });
        //append legal.json from file.content to file.data
        umbrella.contactJson = String(file.contents);
        /* ------------------------------------------------------------------------------------
        ------------ build the file.data object -----------------------------------------------
        ------------------------------------------------------------------------------------ */
        // create the file.data object in case it does not yet exist
        file.data = file.data | {};
        // add legal object to file.data
        file.data.legal = {};
        //parse the legalContactJsonString to the file.data.legal object
        file.data.legal.contact = JSON.parse(umbrella.contactJson);
        //replace file.content with the jade template file
        file.contents = new Buffer(umbrella.jadeTemplate);
    });
};
