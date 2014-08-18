/// <reference path="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore.js" />

/*     Created: 6.6.2014
*          GIT: https://github.com/sevin7676/underscore.morgan
 *      Author: Morgan Yarbrough
 *     Purpose: Add ons for underscore.js
 * Description: Adds additional functionality to underscore.js (which is in AP_Common/live folder)
 *              StandardScripts.js uses underscore, and this is also included.
 *              C# StandardMethod.JS_Header_Include automatically includes this when underscore.js is included
                Intentionally does not use _.mixin as its not needed due to simplicity of these functions and the fact that _.mixin doesnt work properly with tern
 */



/**
* Returns an string by attempting to cast passed object as string;
* @param {object} obj - object to attempt to convert
* @param {string} [defaultOnFail=''] - value to return if the passed object fails to convert to string
*/
_.toStr = function (obj, defaultOnFail) {
    try {
        if (!defaultOnFail) {
            defaultOnFail = '';
        }
    }
    catch (ex) {
        defaultOnFail = '';
    }

    var r = defaultOnFail;
    try {
        r = obj.toString();
    }
    catch (ex) { }
    return r;
};

/**
* Returns an integer by attempting to cast passed object as int;
* (Note: will convert 'px' to int)
* @param {object} obj - object to attempt to convert
* @param {int} [defaultOnFail=-1] - value to return if the passed object fails to convert to int
* @param {bool} [doNotAllowFormatted=false] - pass true to prevent parsing formatted which removes dollar symbol, commas, and assumes negative for parenthesis
*/
_.toInt= function (obj, defaultOnFail, doNotAllowFormatted) {
    try {
        if (isNaN(parseInt(defaultOnFail, 10))) {
            defaultOnFail = -1;
        }
    }
    catch (ex) {
        defaultOnFail = -1;
    }
    try {
        if(!doNotAllowFormatted){
            obj = obj.toString().trim();
            if(obj.toString().substr(0,1) =="("){//first char is paren, use accounting format negative
                //note that replacements for parent are not global intentionally
                obj = obj.toString().replace("(","");
                obj = obj.toString().replace(")","");
                obj ="-"+ obj;//add negative sign
            }
            obj = obj.toString().replace(new RegExp(",","g"),"");//remove all commas
            obj = obj.replace("$","");//remove currency
        }
        var r = parseInt(obj, 10);
        if (!isNaN(r)) {
            return r;
        }
    }
    catch (ex) { }
    return defaultOnFail;
};

/**
* Returns an decimal (float) by attempting to cast passed object as decimal;
* @param {object} obj - object to attempt to convert
* @param {number} [defaultOnFail=-1] - value to return if the passed object fails to convert to decimal
*/
_.toDec= function (obj, defaultOnFail) {
    try {
        if (isNaN(parseFloat(defaultOnFail, 10))) {
            defaultOnFail = -1;
        }
    }
    catch (ex) {
        defaultOnFail = -1;
    }
    try {
        var r = parseFloat(obj, 10);
        if (!isNaN(r)) {
            return r;
        }
    }
    catch (ex) { }
    return defaultOnFail;
};

/**
* Returns an bool by attempting to cast passed object as bool;
* Will convert '1' to true, and 'true' to true (case-insensitive);
* @param {object} obj - object to attempt to convert
* @param {bool} [defaultOnFail=false] - value to return if the passed object fails to convert to bool
*/
_.toBool = function (obj, defaultOnFail) {
    try {
        if (defaultOnFail !== true) {
            defaultOnFail = false;
        }
        //Output('defaultOnFail='+defaultOnFail);
        if (typeof obj === "undefined") {
            return defaultOnFail;
        }
        if (typeof obj === "function") {
            return defaultOnFail;
        }
        if (obj === null) {
            return defaultOnFail;
        }
        if (typeof obj === "boolean") {
            return obj;
        }
        var str = obj.toString().toLowerCase().trim().RemoveSpaces();
        if (str === 'true' || str === '1') {
            return true;
        }
        else if (str === 'false' || str === '1') {
            return false;
        }
        return defaultOnFail;
    }
    catch (ex) {
        setTimeout(function () { console.log('_.toDec error'); throw (ex); }, 0);
    }
    return false;
};

/**
* Returns true if the passed object is null, undefined, or an empty string (white spaces count as empty);
* Attempts to convert object to string to check if empty (a function will not be empty as its body will be returned)
*/
_.empty = function (obj) {
    try {
        if (typeof obj === "undefined") {
            return true;
        }
        if (obj === null) {
            return true;
        }
        if (!obj) {
            return true;
        }
        if (obj.toString().length === 0) {
            return true;
        }
        if (obj.toString().trim() === "") {
            return true;
        }
        return false;//tests passed, string contains something
    }
    catch (ex) {
        return true;//empty
        setTimeout(function () { console.log('_.empty error'); throw (ex); }, 0);
    }
};

/**
 * Logs an object to console with a description and sets a global temp variable for quick access in the console
 * @param {object} obj - object to log
 * @param {string} [str_Description=''] - optional description
 * @param {bool} [bool_DoNotSetVar=false] - pass true to prevent setting global temp variable
 */
_.logO = function (obj, str_Description, bool_DoNotSetVar) {
    if ( typeof window.logOtempCount === "undefined") {
        window.logOtempCount = 0;
    }
    setTimeout(function () {
        try {
            var globalVarName = '';
            if (bool_DoNotSetVar !== true) {
                logOtempCount++;
                if (logOtempCount > 10) {
                    logOtempCount = 1;
                } //max of 10 temp vars
                globalVarName = 'tmp' + logOtempCount;
                window[globalVarName] = object;
                if (str_Description == undefined) {
                    str_Description = '';
                }
                str_Description = globalVarName + ' --- ' + str_Description;
            }
            if (str_Description && str_Description != '') {
                console.log('\n       ' + str_Description + '  (next logged object)   ');
            }
            console.log(object);
        }
        catch (ex) {
            setTimeout(function () { console.log('_.logO error'); throw (ex); }, 0);
        }
    }, 0);
};

/**
 * Converts the passed object to an int and checks if falls within the valid key range
 * @param {object} obj - object to check
 * @param {int} [FirstPossibleNegativeKey=-10] - first valid negative key
 * @param {int} [FirstPossiblePositiveKey=1] - first valid positive key
 * @param {bool} [DoNotAllowNegativeKey=false] - pass true to make negative keys invalid
 */
_.isValidID = function (obj, FirstPossibleNegativeKey, FirstPossiblePositiveKey, DoNotAllowNegativeKey) {
    var r;
    try {
        r = parseInt(obj, 10);
    }
    catch (ex) { return false; }
    FirstPossibleNegativeKey = _.toInt(FirstPossibleNegativeKey, -10);
    FirstPossiblePositiveKey = _.toInt(FirstPossiblePositiveKey, 1);
    if (DoNotAllowNegativeKey !== true) {
        if (r <= FirstPossibleNegativeKey || r >= FirstPossiblePositiveKey) {
            return true;
        }
    }
    else {
        if (r >= FirstPossiblePositiveKey) {
            return true;
        }
    }
    return false;
};

/**
 * Returns true if the passed object is a Error
 */
_.isError = function(obj){
    try{
        if(obj.constructor.name ==='Error'){
            return true;
        }
    }
    catch(ex){}
    return false;
};

/**
 * Returns true if the passed object is a Date or it can be successfully parsed into a date;
 * Will return false if empty object or empty string passed
 */
_.isDate = function(obj){
    try{
        if(_.empty(obj)){
            return false;
        }
        if(obj.constructor.name ==='Date'){
            return true;
        }
        if( new Date(obj.toString()) =="Invalid Date"){
            return false;
        }
        return true;
    }
    catch(ex){}
}

/**
 * gets distinct values as an array from an array of objects (gets all distinct values for a single column from a datatable)
 * @param {[object]} list - array of objects with same properties (datatable)
 * @param {string} propertyName - name of the column to get distinct values for
 */
_.distinct= function(list, propertyName){
    return _.chain(list).pluck(propertyName).sort().uniq(true).value();
}

/*
NOTE: this appears to be the proper way to add functions, but I don't want to do it this way because tern fails to recognize is properly
_.mixin({
       toInt: function (obj, defaultOnFail) {
        try {
            if (isNaN(parseInt(defaultOnFail, 10))) {
                defaultOnFail = -1;
            }
        }
        catch (ex) {
            defaultOnFail = -1;
        }
        try {
            var r = parseInt(obj, 10);
            if (!isNaN(r)) {
                return r;
            }
        }
        catch (ex) { }
        return defaultOnFail;
    },
});
*/