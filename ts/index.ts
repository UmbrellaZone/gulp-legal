/// <reference path="typings/tsd.d.ts" />
var path, through;

through = require("through2");
path = require("path");

module.exports = (options,mojo = undefined) => {
    /* -------------------------------------------------------------------------
    ------------------------- helper functions ----------------------------------
    --------------------------------------------------------------------------
    */
    
    if (mojo != undefined) {
        mojo.log("now prepocessing blog");
    } else {
        console.log('you do not seem to use mojo.io');
        mojo = {}
        mojo.log = function(logthis) {
            console.log(logthis);
        }
    }

    /*--------------------------------------------------------------------------
    ---------------------- returned stream --------------------------------------
    --------------------------------------------------------------------------
    */

    return through.obj(function(file, enc, cb) {
        if (file.isNull() === true) {
            cb(null, file);
            return;
        }
        if (file.isStream()) {
            mojo.log("streaming not supported");
            return;
        }
        
        //append legal.json from file.content to file.data
        jsonString = String(file.contents);
        //create file.data in case it doesn't exist
        file.data = file.data | {};
        file.data.legal = JSON.parse(jsonString);
        
        
        //get the imprint jade file from umbrella.zone and append it to file.content
        
        
    };
};
