/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.js" />

/*jshint maxerr:10000 */

/*     Version: 1.05
 *     Created: 6.6.2014
 *         GIT: https://github.com/sevin7676/underscore.morgan
 *      Author: Morgan Yarbrough
 *     Purpose: Add ons for lodash.js (UPDATED 8.20.2014 to use lodash instead of underscore)
 * Description: Adds additional functionality to underscore.js (which is in AP_Common/live folder)
 *              StandardScripts.js uses underscore, and this is also included.
 *              C# StandardMethod.JS_Header_Include automatically includes this when underscore.js is included
                Intentionally does not use _.mixin as its not needed due to simplicity of these functions and the fact that _.mixin doesnt work properly with tern
 */

/** allow this work work as stand alone */
(function() {
    if (typeof(window) !== "undefined" && !window.hasOwnProperty("_")) {
        window._ = {};
    }
}());
/**
 * Returns an string by attempting to cast passed object as string;
 * Undefined object will return default on fail;
 * PlainObject will return JSON.stringify result;
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
        if (_.isPlainObject(obj)) {
            r = JSON.stringify(obj);
        }
        else {
            r = obj.toString();
        }
    }
    catch (ex) {
        r = defaultOnFail;
    }
    return r;
};

/**
 * Returns an integer by attempting to cast passed object as int;
 * (Note: will convert 'px' to int);
 * Converts boolean to int as true=1, false=0;
 * @param {object} obj - object to attempt to convert
 * @param {int} [defaultOnFail=-1] - value to return if the passed object fails to convert to int
 * @param {bool} [doNotAllowFormatted=false] - pass true to prevent parsing formatted which removes dollar symbol, commas, and assumes negative for parenthesis
 */
_.toInt = function(obj, defaultOnFail, doNotAllowFormatted) {
    try {
        if (typeof defaultOnFail == 'undefined') {
            defaultOnFail = -1;
        }
        else if (isNaN(parseInt(defaultOnFail, 10))) {
            defaultOnFail = -1;
        }
    }
    catch (ex) {
        defaultOnFail = -1;
    }
    try {
        if (_.isBoolean(obj)) {
            if (obj === true) {
                return 1;
            }
            else {
                return 0;
            }
        }
        if (!doNotAllowFormatted) {
            obj = obj.toString().trim();
            if (obj.toString().substr(0, 1) == "(") { //first char is paren, use accounting format negative
                //note that replacements for parent are not global intentionally
                obj = obj.toString().replace("(", "");
                obj = obj.toString().replace(")", "");
                obj = "-" + obj; //add negative sign
            }
            obj = obj.toString().replace(new RegExp(",", "g"), ""); //remove all commas
            obj = obj.replace("$", ""); //remove currency
        }
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
        if (typeof defaultOnFail == 'undefined') {
            defaultOnFail = -1;
        }
        else if (isNaN(parseFloat(defaultOnFail, 10))) {
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
 * Returns true if the passed object is null, undefined, empty string (white spaces count as empty), array with length zero, or plain object with no keys;
 * Array with length of zero returns true (empty);
 * A plain object will return true (empty) if it has no keys;
 * The number zero will return false (not empty), same goes for any number;
 * Attempts to convert object to string to check if empty (a function will not be empty as its body will be returned);
 */
_.empty = function(obj) {
    try {
        if(obj == null){
            //note: == with null returns true if object is undefined OR null
            return true;
        }
        if (obj.toString().trim().length === 0) {
            return true;
        }
        if (_.isPlainObject(obj)) {
            if (_.keys(obj).length === 0) { //number of keys in object
                return true;
            }
        }
        /* removed 10.1.2014- this would return empty for number 0
        if (!obj) {
            return true;
        }*/

        /* note: dont need this test as any number would passa above tests, and false is returned if below as default
        if(_.isNumber(obj)){
            return false;//number are not empty;
            //added this on 10.1.2014- dont want '0' to be evaluated as empty
        }*/

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
 * Logs an object to console with a description and sets a global temp variable for quick access in the console
 * @param {object} obj - object to log
 * @param {string} [str_Description=''] - optional description
 * @param {bool} [bool_DoNotSetVar=false] - pass true to prevent setting global temp variable
 */
_.logO = function(obj, str_Description, bool_DoNotSetVar) {
    if (typeof window.logOtempCount === "undefined") {
        window.logOtempCount = 0;
    }
    setTimeout(function() {
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
            setTimeout(function() {
                console.log('_.logO error');
                throw (ex);
            }, 0);
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
_.isValidID = function(obj, FirstPossibleNegativeKey, FirstPossiblePositiveKey, DoNotAllowNegativeKey) {
    var r;
    try {
        r = parseInt(obj, 10);
    }
    catch (ex) {
        return false;
    }
    FirstPossibleNegativeKey = _.toInt(FirstPossibleNegativeKey, - 10);
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
_.isError = function(obj) {
    try {
        if (obj.constructor.name === 'Error') {
            return true;
        }
    }
    catch (ex) {}
    return false;
};

/**
 * Returns true if the passed object is a Date or it can be successfully parsed into a date;
 * Will return false if empty object or empty string passed
 */
_.isDate = function(obj) {
    try {
        if (_.empty(obj)) {
            return false;
        }
        if (obj.constructor.name === 'Date') {
            return true;
        }
        if (new Date(obj.toString()) == "Invalid Date") {
            return false;
        }
        return true;
    }
    catch (ex) {}
};

(function() {
    try {
        //override original
        if (_.hasOwnProperty('IsNumber')) {
            _.originalIsNumber = _.isNumber;
        }
        /**
         * Returns true if passed object is numeric;
         * Will automatically attempt to parse the object as a number;
         * Returns false for accounting negative, example :(1);
         * Returns false for signed numbers, example: $1
         */
        _.isNumber = function(obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        };
    }
    catch (ex) {
        setTimeout(function() {
            throw ex;
        }, 0);
    }
}());

/**
 * gets distinct values as an array from an array of objects (gets all distinct values for a single column from a datatable)
 * @param {[object]} list - array of objects with same properties (datatable)
 * @param {string} [propertyName] - name of the column to get distinct values for or blank if simple array
 */
_.distinct = function(list, propertyName) {
    return _.chain(list).pluck(propertyName).sort().uniq(true).value();
};

/**
 * Merge an unknown parameter with a deafult object to get a parameter vale (for optional default object parameters);
 * Uses lodashes deep merge function;
 * Catches and logs errors;
 * @param {object} [defaultObject={}] - an object that contains default values for the parameter (does not have to be plain object)
 * @param {any} [parameter={}] - any value (nul, undefined, object, string, etc) to be merged with defaultObject, wont be merged unless it passes the isObject check (which is true for functions)
 */
_.mergeDefault = function(defaultObject, parameter) {
    var r = {};
    try {
        //default object is required... but just in case lets return empty object instead of error
        defaultObject = _.isObject(defaultObject) ? defaultObject : {};
        parameter = _.isObject(parameter) ? parameter : {};
        r = _.merge(defaultObject, parameter);
    }
    catch (ex) {
        setTimeout(function() {
            throw ex;
        }, 0);
    }
    return r;
};

/**
 
 */


/**
 * @description Debounces function with arguments and recudes the arguments from multiple calls using the combine function;
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @param {Function(allArgs[],currentArgs[])-->[]} [combine] function that takes two params: allArgs (accumulated) and args from current call and returns  args to use when debounced function is called.
 * @returns {Function} Returns the new debounced function.
 *
 * @link https://github.com/jashkenas/underscore/issues/310#issuecomment-2510502  *
 * @example for deboucneRecude (not in comments above func as its messy in tern)
 *
 *   self.m.setValueInput = _.debounceReduce(self.m.setValueInput, 20, function(allArgs, currentArgs) {
 *      //default all args
 *      if(!_.isArray(allArgs)){
 *          allArgs=[false,false];//setValueInput accepts 2 params, each with default value of false
 *      }
 *
 *      //arg0= forceRefill; default false, if any calls have this as true, then pass true
 *      if(!_.toBool(allArgs[0]) && currentArgs.length>=1){
 *          allArgs[0]=_.toBool(currentArgs[0]);
 *      }
 *
 *      //arg1= DoNotFocus; default false, if any calls have this as true, then pass true
 *      if(!_.toBool(allArgs[1]) && currentArgs.length>=2){
 *          allArgs[1]=_.toBool(currentArgs[1]);
 *      }
 *      return allArgs;
 *   });
 */
_.debounceReduce = function(func, wait, options, combine) {
    var allargs,
    context,
    wrapper = _.debounce(function() {
        var args = allargs;
        allargs = undefined;
        func.apply(context, args);
    }, wait, options);
    return function() {
        context = this;
        allargs = combine.apply(context, [allargs, Array.prototype.slice.call(arguments, 0)]);
        wrapper();
    };
};

/**
 * @note: name would _.in but in is a keyword in javscript and this makes certain editor tools go crazy
 * @returns {bool} indicating if first argument equals any other arugments using strict equality comparison ('===')
 * @param {*} value - value to check agaisnt all other arguments
 * @param {...*} values to compare to first value
 */
_.n = function(value, n1, n2, n3, n4){
    for (var i = 1; i < arguments.length; i++) {
        if (value === arguments[i]) return true;
    }
    return false;
};

/**
 * @returns {string} with all regexp special characters escaped
 * @param {string} str - string to escape
 */
_.escapeRegExp = function(str){
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

/**
 * @return {string} string with all instances of search replaced by replacment
 * @param {string} str  - string to perform replacement on
 * @param {search} search - string to search for
 * @param {string} replacement - string to replace search
 * @param {bool} [ignoreCase=false] - pass true to do case insensitive replace
 *
 */
_.replaceAll = function(str, search, replacement, ignoreCase){
    return str.replace(new RegExp(_.escapeRegExp(search), ignoreCase ? 'ig' : 'g'), replacement);
};


/**
 * string maniuplation functions copied from [underscore.string](http://epeli.github.io/underscore.string/) (only copied the ones I want to use)
 */
_.s = {
    /**
     * @returns {string} Converts passed string to camelcase;
     * @param {string} str
     */
    camelize: function(str) {
        return str.trim().replace(/[-_\s]+(.)?/g, function(match, c) {
            return c.toUpperCase();
        });
    },

    /**
     * @returns {string} Capitalizes first letter of passed string;
     * @param {string} str
     */
    capitalize: function(str) {
        str = str === null ? '' : String(str);
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * @returns {string} Turns string into human reading format;
     * @param {string} str
     */
    humanize: function(str) {
        return _.s.capitalize(_.s.underscored(str).replace(/_id$/, '').replace(/_/g, ' '));
    },

    /**
     * @returns {string} trims string and replace spaces with underscores;
     * @param {string} str
     */
    underscored: function(str) {
        return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },
    
    /**
     * @returns {string} html encoded string
     * @param {string} str - string to encode
     */
    htmlEncode: function(str) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
        };
        return String(str).replace(/[&<>]/g, function(s) {
            if (!s) return '';
            return entityMap[s];
        });
    },
    
    /**
     * @returns {string} string with  html line breaks [<br/>] replaced with [\n]
     * @param {string} str
     */
    htmlBreakToNewLine: function(str){
        return str.replace(/< ?br ?\/? ?>/gi,'\n');
    }
    
    
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