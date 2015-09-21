/// <reference path="typings/tsd.d.ts" />
var through = require("through2");
var path = require("path");
var remotefile = require("remotefile");
var smartparam = require("smartparam");

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
        umbrella.jadeTemplate = remotefile('https://raw.githubusercontent.com/UmbrellaZone/umbrella-legal/master/00dev/jade/index.jade');
        //get the legalTexts.json file and parse it
        umbrella.legalTexts = remotefile('https://raw.githubusercontent.com/UmbrellaZone/umbrella-legal/master/01build/content.json',{parseJson:true});
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
