/// <reference path="typings/tsd.d.ts" />
var bl = require("beautylog");
var through = require("through2");
var path = require("path");
var remotefile = require("remotefile");
var smartparam = require("smartparam");
/**
 * returns a gulp stream object.
 * @param umbrellaOptions
 * @returns {any}
 */
module.exports = function (umbrellaOptions) {
    /* -------------------------------------------------------------------------
    ------------------------- helper functions ----------------------------------
    --------------------------------------------------------------------------
    */
    if (umbrellaOptions === void 0) { umbrellaOptions = undefined; }
    var logBool = false;
    if (umbrellaOptions != undefined && umbrellaOptions.logging == true)
        logBool = true;
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
            bl.log("streaming not supported");
            return;
        }
        /* ------------------------------------------------------------------------------------
       ------------ create umbrella object ----------------------------------------------------
       ------------------------------------------------------------------------------------ */
        var umbrella = {};
        //get the jade Template from GitHub
        umbrella.jadeTemplate = remotefile('https://raw.githubusercontent.com/UmbrellaZone/umbrella-legal/master/00dev/jade/index.jade');
        //get the legalTexts.json file
        umbrella.legalTexts = remotefile('https://raw.githubusercontent.com/UmbrellaZone/umbrella-legal/master/01build/content.json');
        //append legal.json from file.content to file.data
        umbrella.contactJson = String(file.contents);
        /* ------------------------------------------------------------------------------------
        ------------ build the file.data object -----------------------------------------------
        ------------------------------------------------------------------------------------ */
        // add data to file, smartparam takes care of looking if it already exists.
        smartparam(file, 'data');
        // add legal object to file.data
        file.data.legal = {};
        if (umbrellaOptions != undefined) {
            file.data.legal.options = umbrellaOptions;
        }
        else {
            file.data.legal.options = {};
        }
        //parse the legalContactJsonString to the file.data.legal object
        file.data.legal.contact = JSON.parse(umbrella.contactJson);
        //replace file.content with the jade template file
        file.contents = new Buffer(umbrella.jadeTemplate);
    });
};
