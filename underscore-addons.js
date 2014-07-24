/// <reference path="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore.js" />

/*     Created: 6.6.2014
*          GIT: https://github.com/sevin7676/underscore.morgan
 *      Author: Morgan Yarbrough
 *     Purpose: Add ons for underscore.js
 * Description: Adds additional functionality to underscore.js (which is in AP_Common/live folder)
 *              StandardScripts.js uses underscore, and this is also included.
 *              C# StandardMethod.JS_Header_Include automatically includes this when underscore.js is included
                Intentionally does not use _.mixin as its not needed due to simplicity of these functions and the fact that _.mixin doesnt work properly with tern
      Wrapper: Intended to make the thing work with Node or AMD, but not tested (only tested for window global)
 */


// loader shim from: https://github.com/umdjs/umd/blob/master/returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    }
    else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function() {
    var _ = {};
    /**
     * Returns an string by attempting to cast passed object as string;
     * @param {object} obj - object to attempt to convert
     * @param {string} [defaultOnFail=''] - value to return if the passed object fails to convert to string
     */
    _.toStr = function(obj, defaultOnFail) {
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
        catch (ex) {}
        return r;
    };

    /**
     * Returns an integer by attempting to cast passed object as int;
     * (Note: will convert 'px' to int)
     * @param {object} obj - object to attempt to convert
     * @param {int} [defaultOnFail=-1] - value to return if the passed object fails to convert to int
     */
    _.toInt = function(obj, defaultOnFail) {
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
        catch (ex) {}
        return defaultOnFail;
    };

    /**
     * Returns an decimal (float) by attempting to cast passed object as decimal;
     * @param {object} obj - object to attempt to convert
     * @param {number} [defaultOnFail=-1] - value to return if the passed object fails to convert to decimal
     */
    _.toDec = function(obj, defaultOnFail) {
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
        catch (ex) {}
        return defaultOnFail;
    };

    /**
     * Returns an bool by attempting to cast passed object as bool;
     * Will convert '1' to true, and 'true' to true (case-insensitive);
     * @param {object} obj - object to attempt to convert
     * @param {bool} [defaultOnFail=false] - value to return if the passed object fails to convert to bool
     */
    _.toBool = function(obj, defaultOnFail) {
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
            setTimeout(function() {
                console.log('_.toDec error');
                throw (ex);
            }, 0);
        }
        return false;
    };

    /**
     * Returns true if the passed object is null, undefined, or an empty string (white spaces count as empty);
     * Attempts to convert object to string to check if empty (a function will not be empty as its body will be returned)
     */
    _.empty = function(obj) {
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
            return false; //tests passed, string contains something
        }
        catch (ex) {
            setTimeout(function() {
                console.log('_.empty error');
                throw (ex);
            }, 0);
            return true; //empty
        }
    };

    /**
     * Converts the passed object to an int and checks if falls within the valid key range
     * @param {object} obj - object to check
     * @param {int} [FirstPossibleNegativeKey=-10] - first valid negative key
     * @param {int} [FirstPossiblePositiveKey=1] - first valid positive key
     * @param {bool} [DoNotAllowNegativeKey=false] - pass true to make negative keys invalid
     */
    _.isValidID = function(obj, FirstPossibleNegativeKey, FirstPossiblePositiveKey, DoNotAllowNegativeKey) {
        var r;
        try {
            r = parseInt(obj, 10);
        }
        catch (ex) {
            return false;
        }
        try {
            FirstPossibleNegativeKey=parseInt(FirstPossibleNegativeKey, 10);
            if (isNaN(FirstPossibleNegativeKey)) {
                FirstPossibleNegativeKey = -10;
            }
        }
        catch (ex) {
            FirstPossibleNegativeKey = -10;
        }
        try {
            FirstPossiblePositiveKey=parseInt(FirstPossiblePositiveKey, 10);
            if (isNaN(FirstPossiblePositiveKey)) {
                FirstPossiblePositiveKey = 1;
            }
        }
        catch (ex) {
            FirstPossiblePositiveKey = 1;
        }
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
    _.isError = function(obj) {
        try {
            if (obj.constructor.name === 'Error') {
                return true;
            }
        }
        catch (ex) {}
        return false;
    };

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
    //if loaded in browser, use this hack to set global variable (ghetto)
    if(this.constructor.name ==='Window'){
        for(var p in _){
            window['_'][p]=_[p];
        }
        return {};
    }

    return _;
}));
