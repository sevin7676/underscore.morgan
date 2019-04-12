/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.js" />

/*jshint maxerr:10000, eqnull:true */

/*!     Version: 1.26
 *     Created: 6.6.2014
 *         GIT: https://github.com/sevin7676/underscore.morgan
 *      Author: Morgan Yarbrough
 *     Purpose: Add ons for lodash.js (UPDATED 8.20.2014 to use lodash instead of underscore)
 * Description: Adds additional functionality to underscore.js (which is in AP_Common/live folder)
 *              StandardScripts.js uses underscore, and this is also included.
 *              C# StandardMethod.JS_Header_Include automatically includes this when underscore.js is included
                Intentionally does not use _.mixin as its not needed due to simplicity of these functions and the fact that _.mixin doesnt work properly with tern
 */

(function() {
    /** allow this work work as stand alone (only some functions will work) */
    if (typeof(window) !== "undefined" && window._ == null) {
        window._ = {};
    }
}());


/**
 * Returns an string by attempting to cast passed object as string;
 * Undefined object will return default on fail;
 * PlainObject will return JSON.stringify result;
 * @param {object} obj - object to attempt to convert
 * @param {string} [defaultOnFail=''] - value to return if the passed object fails to convert to string
 * @param {bool} [detailed=false] - (use for debugging and logging) if true, the following values will return:
 *      undefined: `[undefined]`
 *      null: `[null]`
 *      If this is true, an object that is stringified will check if the serialized result matches the original object. If it doesn't match, then this will prepend a string that tells us that functions were removed. WARNING: This comparison can be very slow. This is here because JSON.Stringify skips functions as they cant be serialized.
 */
_.toStr = function(obj, defaultOnFail, detailed) {
    if (defaultOnFail === undefined) defaultOnFail = '';
    var r = defaultOnFail;
    try {
        var stringify = function(value) {
            var tmp = JSON.stringify(obj);
            if (detailed && !_.isEqual(JSON.parse(tmp), obj)) {
                tmp = '[Functions Removed] ' + tmp;
            }
            return tmp;
        };
        var inner = function() {
            if (_.isPlainObject(obj)) {
                r = stringify(obj);
            }
            else {
                r = obj.toString();
                //fix object stringify
                if (detailed && r.toLowerCase() == '[object object]') r = stringify(obj);
            }
        };
        if (detailed) {
            if (_.isUndefined(obj)) {
                r = '[undefined]';
            }
            else if (_.isNull(obj)) {
                r = '[null]';
            }
            else inner();
        }
        else inner();
    }
    catch (ex) {
        r = defaultOnFail;
        if (detailed) {
            setTimeout(function() {
                console.log('error in _.toStr(); \tobj:', obj, '\tError', ex);
            }, 0);
        }
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
        if (defaultOnFail === undefined) defaultOnFail = -1;
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
 * @returns {bool} true if passed number can be converted to int
 * @param {object} obj - object to attempt to convert
 * @param {int} [defaultOnFail=-1] - value to return if the passed object fails to convert to int
 * @param {bool} [doNotAllowFormatted=false] - pass true to prevent parsing formatted which removes dollar symbol, commas, and assumes negative for parenthesis
 */
_.isInt = function(obj, doNotAllowFormatted) {
    var defaultOnFail = -73737373; //random number that is insanely unlikely to get passed to this function
    return _.toInt(obj, defaultOnFail, doNotAllowFormatted) != defaultOnFail;
};

/**
 * Returns an decimal (float) by attempting to cast passed object as decimal;
 * @param {object} obj - object to attempt to convert
 * @param {number} [defaultOnFail=-1] - value to return if the passed object fails to convert to decimal
 */
_.toDec = function(obj, defaultOnFail) {
    try {
        if (defaultOnFail === undefined) defaultOnFail = -1;
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
        else if (str === 'false' || str === '0') {
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
        if (obj == null) {
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
 * gets distinct values as an array from an array of objects
 * (gets all distinct values for a single column from a datatable)
 * @param {[object]} list - array of objects with same properties (datatable)
 * @param {string|array<string>} [propertyName] - name(s) of the column(s) to get distinct values for or blank if simple array
 * @param {bool} [ops.noSort=false] - pass true to not sort the result (result is never sorted if using multiple properties)
 * @param {array<string>} [ops.nameMap] - array (must be same length as propertyNames) of new names for properties.
 *      This allows mapping at same time as distinct.
 *      (Only works when propertyName is an array)
 */
_.distinct = function(list, propertyName, ops) {
    // var sw = new apTimer(true);//uncomment sw to benchmark (requires standardScripts.js)
    var r = [];

    //legacy: 3rd param used to be noSort
    var noSort;
    if (ops === true) {
        noSort = true;
        ops = null;
    }
    ops = ops || {};
    ops.noSort = ops.noSort || noSort || false;

    if (_.isArray(propertyName)) {
        var added = {},
            mapNames = false;

        if (_.isArray(ops.nameMap)) {
            if (ops.nameMap.length != propertyName.length) throw new TypeError('nameMap passed but it is not the same length as the propertyNames array; propertyNames: ' + propertyName.toString() + '; nameMap:' + ops.nameMap.toString());
            mapNames = true;
        }

        _.each(list, function(v, i, arr) {
            var thisRowMapped = {};
            _.each(propertyName, function(x, n) {
                thisRowMapped[mapNames ? ops.nameMap[n] : x] = v[x];
            });

            var key = JSON.stringify(thisRowMapped);
            if (key in added) return;

            added[key] = true;
            r.push(thisRowMapped);
        });
    }
    else {
        r = _.chain(list).pluck(propertyName);
        if (ops.noSort) r = r.uniq(false).value();
        else r = r.sort().uniq(true).value();
    }

    // sw.logTable('_.distinct', (propertyName ? 'propertyName(s): ' + propertyName.toString() : '(no property)'), 'list length: ' + list.length, 'list columns: ' + _.keys(list[0]).length);
    return r;
};

/**
 * Merge an unknown parameter with a deafult object to get a parameter value (for optional default object parameters).
 * Uses lodashes deep merge function.
 * Arrays are not valid parameters unless they are nested in an ojbect.
 * Catches and logs errors.
 * @param {object} [defaultObject={}] - an object that contains default values for the parameter (does not have to be plain object)
 * @param {any} [parameter={}] - any value (nul, undefined, object, string, etc) to be merged with defaultObject, wont be merged unless it passes the isObject check (which is true for functions)
 * @param {bool} [fast=false] - pass true to do a shallow merge and prevent extra checks for invalid junk, can increase performance by 10x for large objects but ignores almost all validation.
 *      DO NOT set this to true without testing as its behavior is less than desirable in many cases.
 *      If false, this MIGHT modify the default object (not sure... do more testing).
 *      If false this will not work properly if either object passed is an array (as arrays shouldnt be passed!)
 *
 */
_.mergeDefault = function(defaultObject, parameter, fast) {
    //uncomment sw to benchmark (requires standardScripts.js)
    /*var sw = new apTimer(true);*/
    var r = {};
    var err = '';
    try {
        if (fast) {
            r = _.defaults(parameter || {}, defaultObject || {});
        }
        else {
            //check for arrays as they will pass isObject and we dont want that
            if (_.isArray(defaultObject)) {
                defaultObject = {};
                err = 'defaultObject is an array, which is invalid';
            }
            if (_.isArray(parameter)) {
                parameter = {};
                err = 'parameter is an array, which is invalid';
            }
            //default object is required... but just in case lets return empty object instead of error
            //note: clone default so we don't modify it
            defaultObject = _.isObject(defaultObject) ? _.cloneDeep(defaultObject) : {};
            parameter = _.isObject(parameter) ? parameter : {};
            r = _.merge(defaultObject, parameter);

            //log instead of throw so qunit tests will work
            if (err) console.error('_.mergeDefault error: ' + err);
            // if (err) throw new Error('_.mergeDefault error: ' + err);
        }
    }
    catch (ex) {
        setTimeout(function() {
            throw ex;
        }, 1);
    }
    /*sw.stop();
    sw.logTable('_.mergeDefault; fast:' + _.toBool(fast), _.toStr(r, 'failedToStringify', true));*/
    return r;
};

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
 * Debounce Advanced (better than built in from lodash)
 * Debounces a function for the passed object or does it globally
 * @param {object} obj - pass null or an object that will be used for the scope of debouncing at the passed key
 * @param {string} key - a key unique to current instance for the fucntion being debounced
 * @param {function} fn - function to debounce
 * @param {number} delay - debouce delay in milliseconds.
 *      Pass -1 or a non-numeric value to execute function immediately (no debounce, not async)
 * @param {object} [ops]
 * @param {bool} [ops.debug=false] - pass true to log debug info
 * @param {string|function} [ops.debugId] - string to log for debugging to help identify caller.
 *      If function, then calling function should return string
 * @note make sure not to use `this` in inner function (obvious)
 *
 * @example
 *
 * //debounce using object for scope
 * this.something = function() {
 *     _.debounceA(this, 'something', 10, inner);
 *
 *     function inner() {}
 * };
 *
 *
 * @example
 *
 * //debounce using global scope - only second call will get executed
 * _.debounceA(null, 'something', 10, function() { console.log('test 1'); });
 * _.debounceA(null, 'something', 10, function() { console.log('test 2'); });
 *
 */
_.debounceA = function(obj, key, delay, fn, ops) {
    //get/setup global debounce object
    var k = '__usDebounce';
    if (window[k] === undefined) window[k] = {};

    //use global or passed object
    var useGlobal = obj == null;
    if (!useGlobal) obj[k] = obj[k] || {};

    ops = ops || {};
    delay = parseInt(delay, 10);

    //if delay is not a number, or its -1, then execute immediately
    if (isNaN(delay) || delay === -1) {
        dbg('executing immediately', 'color:orange; font-weight:bold;');
        fn();
        return;
    }

    var parent = useGlobal ? window[k] : obj[k];
    clearTimeout(parent[key]);
    dbg('called', 'color:gray;');

    parent[key] = setTimeout(function() {
        dbg('executing', 'color:green; font-weight:bold;');
        fn();
    }, delay);

    function dbg(msg, css) {
        if (!ops.debug) return;
        msg = 'apDebounce ' + msg + ' \t delay: ' + delay + ' \t key: ' + key;
        if (ops.debugId) {
            if (typeof ops.debugId === 'function') ops.debugId = ops.debugId();
            msg += '\t id: ' + ops.debugId;
        }
        if (css) {
            msg = '%c ' + msg;
            console.log(msg, css);
            return;
        }
        console.log(msg);
    }
};

/**
 * @note: name would _.in but in is a keyword in javscript and this makes certain editor tools go crazy
 * @returns {bool} indicating if first argument equals any other arugments using strict equality comparison ('===')
 * @param {*} value - value to check agaisnt all other arguments
 * @param {...*|array<*>} values to compare to first value or single array (only pass two params for array) which will be used to compare to first
 */
_.n = function(value, n1, n2, n3, n4) {
    //if 2nd arg is array, then use it for comparison
    var possible = arguments[1];
    if (_.isArray(possible)) {
        //NOTE: this does not conflict with anything because this method wont work for comparing arrays, example:
        // this evaulates to false: [1,2,3] === [1,2,3]
        // because of this, we can assume that if the 2nd param is array then its the objects to compare
        if (arguments.length > 2) {
            console.log('_.n() error (next log); \targuments:', Array.prototype.slice.call(arguments));
            setTimeout(function() {
                throw new TypeError('_.n parameter error. 2nd parameter is array, which will be used for comparison, but more than 2 arguments are passed(these will be skipped). This this error is a warning that this method is likely being used improperly, however evaluation of this method is continuting.');
            }, 0);
        }
    }
    else {
        //use all arguments after first
        possible = Array.prototype.slice.call(arguments, 1);
    }

    for (var i = 0; i < possible.length; i++) {
        if (value === possible[i]) return true;
    }
    return false;
};

/**
 * @returns {string} with all regexp special characters escaped
 * @param {string} str - string to escape
 */
_.escapeRegExp = function(str) {
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
_.replaceAll = function(str, search, replacement, ignoreCase) {
    return str.replace(new RegExp(_.escapeRegExp(search), ignoreCase ? 'ig' : 'g'), replacement);
};

/**
 * @returns {string} html string: name: value(tostring)
 * @param {*} value - value to display
 * @param {string} name - display name of the value
 * @param {string} [separator=<div>] - value to add before result for separation.
 *      Pass null or undefined to wrap in div, or pass special value 'span' to wrap in span, or any other characters (such as comma or line break)
 * @param {int} [maxL=-1] - pass a positive int to trim the length of display value
 * @param {bool} [skipIf=undefined] - string to compare to the value.toString(), if equal the result of this function will be an empty string.
 *      Pass empty string to equal null or empty string.
 *      Pass 'undefined' (as string) to skip if value is undefined
 *      The comparison is case insensitive and ignores whitespace on ends of string
 * @param {bool} [noHtml=false] - pass true to skip html formatting
 * @param {object} [ops] - additional options
 * @param {bool} [ops.noType=false] - pass true to prevent adding type data when not string or number
 * @param {bool} [ops.allowBlank=false] - pass true allow returning empty string instead of '[null],[undefined],[emptyString]'
 * @param {bool} [ops.colorBool=true] - pass false to prevent coloring value if its a boolean or 'True/False'
 * @param {string} [ops.colon=': '] - the string to separate text from value (may want to pass ' = ')
 * @param {string} [ops.valueCss=''] - extra css to wrap value in (will wrap value in span if set)
 */
_.v = function(value, name, separator, maxL, skipIf, noHtml, ops) {
    try {
        ops = _.mergeDefault({
            noType: false,
            allowBlank: false,
            colorBool: true,
            colon: ': ',
            valueCss: '',
        }, ops, true);
        maxL = _.toInt(maxL);
        var skipIfset = !_.isUndefined(skipIf);
        if (separator == null) separator = '<div>';

        //#region separator
        var separatorEnd = ''; // /<?div>?/i.test(separator) ? '</div>' : (/<?span>?/i.test(separator) ? '</span>' : '');
        if (/<?div>?/i.test(separator)) {
            separator = '<div>';
            separatorEnd = '</div>';
            if (noHtml) separator = separatorEnd = ' ';
        }
        else if (/<?span>?/i.test(separator)) {
            separator = '<span style="margin:0 20px;">';
            separatorEnd = '</span>';
            if (noHtml) separator = separatorEnd = ' ';
        }
        if (noHtml) {
            separator = _.s.removeHtml(separator);
            separatorEnd = _.s.removeHtml(separatorEnd);
        }
        //#endregion

        //#region value to string
        if (value === null) {
            if (skipIfset && skipIf === null) return '';
            value = "[null]";
            if (ops.allowBlank) value = '';
        }
        else if (value === undefined) {
            if (skipIfset && skipIf === 'undefined') return '';
            value = "[undefined]";
            if (ops.allowBlank) value = '';
        }
        else if (_.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
            if (skipIfset && skipIf === '') return '';
            if (_.empty(value)) value = "[emptyString]";
            if (ops.allowBlank) value = '';
        }
        else {
            value = _.toStr(value, 'Failed to convert object to string', true);
            if (skipIfset && _.s.equalsNoCase(value, skipIf)) return '';
            if (!noHtml && !ops.noType) {
                var type = '';
                if (_.isFunction(value)) type = '[Function]';
                else if (_.isArguments(value)) type = '[Arguments]';
                else if (_.isArray(value)) type = '[Array]';
                else if (_.isError(value)) type = '[Error]';
                else if (_.isDate(value)) type = '[Date]';
                else if (_.isPlainObject(value)) type = '[PlainObject]';
                else if (_.isObject(value)) type = '[Object]';
                else type = '[Unknown(' + typeof value + ')]';
                value = '<span style="color:grey;">' + type + '</span> ' + value;
            }
        }

        //trim max length
        if (maxL > 0 && value.length > maxL) value = value.substr(0, maxL - 2) + '..';

        //special coloring for boolean
        if (!noHtml && ops.colorBool) {
            if (_.s.equalsNoCase(value, 'true')) value = '<span style="font-weight:bold; color:green;">true</span>';
            else if (_.s.equalsNoCase(value, 'false')) value = '<span style="color:red;">false</span>';
        }
        //#endregion

        if (noHtml) name = name;
        else name = '<span style="color:#036CC2;">' + name + '</span>'; //color name

        if (!_.empty(value)) name += ops.colon;
        else name += ' ';

        if (!noHtml && ops.valueCss) value = '<span style="' + ops.valueCss + '">' + value + '</span>';

        return separator + name + value + separatorEnd;
    }
    catch (ex) {
        setTimeout(function() {
            throw ex;
        }, 0);
    }
};

/**
 * @returns {function} passed function wrapped in double click handler that will modify the event argument to include a property that identifies if the event was fired from a double click.
 * @param {function} func - event handler
 * @param {object} [ops] - options
 * @param {number} [ops.delay=300] - double click delay. Set to -1 to not use double click handling (double clicking will be ignored for middle and right click)
 * @param {bool} [ops.getButtonIsJqueryNormalized=true] when true, this will assume that getButton function returns numbers based on jquery `which` normalization
 * @param {string} [ops.clickInfoPropName=_clickInfo] - name of the property to add to arguments parameter that contains clickInfo class instance
 * @param {function} [ops.getButton] - a function that accepts event parameter and returns clicked button number. Leave default to automatically parse standard jquery event.
 * @param {function} [ops.debug=false] - set to true to automatically log debug info
 * @param {function} [ops.ignoreRightClick=true] - if true, will not fire (func) event handler for right click. This is desired in most cases when binding with 'mousedown' (which is required for middle click to work) instead of binding with 'click', which will not catch middle or right clicks
 *
 *
 * @note: this does not do binding! it only handles events. use the example below to handle
 *
 * @example
 *
 *      $('selector').on('mousedown', _.handleClick(function(e) {
 *          //NOTE: must bind with mousedown to catch middle click (will ignore right click if ops.ignoreRightClick is true); Binding with 'click' will not catch middle click
 *          console.log('newWindow= ' + e._clickInfo.newWindow;);//newWindow true if double, ctrl+left, or middle button
 *          console.log('button= ' + e._clickInfo.button);
 *      }));
 */
_.handleClick = function(func, ops) {
    /** @returns {string} left|middle|right */
    var getButton = function(e) {
        return _.browser().mouseBtn(ops.getButton(e), ops.getButtonIsJqueryNormalized);
    };
    /**
     * info about click event normalizd across browsers
     * @param {object} e - event object
     * @param {bool} isDouble
     */
    var clickInfo = function(e, isDouble) {
        var sf = this;
        /** @type {string} one of the following: left,right,middle  (or empty if not set) */
        this.button = '';
        /** @type {bool} is double click */
        this.isDouble = _.toBool(isDouble);
        /** @type {bool} is right click */
        this.isRight = false;
        /** @type {bool} is left click */
        this.isLeft = false;
        /** @type {bool} is middle click */
        this.isMiddle = false;
        /** @type {bool} will be true if: (isLeft && isDouble) || (isLeft && ctrlKey) || isMiddle */
        this.newWindow = false;
        /** original handleClick options */
        this.ops = ops;
        /** parse event */
        (function() {
            try {
                sf.button = getButton(e);
                sf.isRight = sf.button === 'right';
                sf.isLeft = sf.button === 'left';
                sf.isMiddle = sf.button === 'middle';
                sf.newWindow = (sf.isLeft && sf.isDouble) || (sf.isLeft && e.ctrlKey) || sf.isMiddle;
            }
            catch (ex) {
                throw new Error('Failed to parse event data to get button;\n\n' + ex);
            }
        })();
    };

    if (!_.isFunction(func)) throw new TypeError('expected a function');

    ops = _.mergeDefault({
        delay: 300,
        clickInfoPropName: '_clickInfo',
        getButtonIsJqueryNormalized: true,
        debug: false,
        ignoreRightClick: true,
        /**
         * this default function parses normal and jquery event object and returns the 'which' object that is normalized.
         * http://api.jquery.com/category/events/event-object/.
         */
        getButton: function(e) {
            return e.which;
        },
    }, ops, true);

    var clickCount = 0,
        args = null,
        timer = null;

    var inner = function() {
        clearTimeout(timer);
        var ci = new clickInfo(args[0], clickCount > 1); //will throw own descriptive error
        try {
            args[0][ops.clickInfoPropName] = ci;
            if (ops.ignoreRightClick && ci.isRight) return;
        }
        catch (ex) {
            throw new TypeError('_.handleClick Error: the event that triggered this did not pass the correct arugments. The first argument must be an object.\n\n' + ex);
        }
        clickCount = 0;
        
        if (ops.debug)
            console.log('_.handleClick debug; clickCount:' + clickCount + '; \nclickInfo:', ci, '\nargs:', args);
        
        func.apply(this, args);
    };

    return function() {
        var self = this; //`this` is the scope of the event handler, which is what we want to pass on
        args = Array.prototype.slice.call(arguments); //(this works when arguments are not passed)
        clickCount++;

        //if ops.delay <0, then invoke immediately (no double click handling), also no double for middle or right clicking
        if (getButton(args[0]) === 'left' && ops.delay > 0 && clickCount === 1) {
            timer = setTimeout(function() {
                inner.apply(self);
            }, ops.delay);
        }
        else inner.apply(self);
    };
};

/**
 * @returns {bool} true if object has property
 * @param {object} obj - object to check for property
 * @param {string} key - key to check for
 * @param {bool} [skipProto=false] - pass true to check that object has property directly defined without including if its defined on its prototype
 * @param {bool} [skipUndefined=false] - pass true to return false if the key exists on the object but the value at the key is undefined
 *
 * @note there is no way to distinguish if a property in the prototype was defined directly on the object or mixed in
 * @note errors are caught and logged after delay
 */
_.has = function(obj, key, skipProto, skipUndefined) {
    var r = false;
    try {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        // http://jsperf.com/hasownproperty-vs-in-vs-undefined/75
        // performance (scaled to slowest performer, higher number is x times faster):
        // 1. key in:           1
        // 2. hasOwnProperty:   2.3
        // 3. undefined check:  152
        // checks below will check for undefined first when allowed because its so much faster

        if (skipProto) {
            if (skipUndefined) r = typeof obj[key] !== 'undefined' && obj.hasOwnProperty(key);
            else r = obj.hasOwnProperty(key);
        }
        else {
            if (skipUndefined) r = typeof obj[key] !== 'undefined';
            else r = typeof obj[key] !== 'undefined' || key in obj;
        }
    }
    catch (ex) {
        setTimeout(function() {
            console.log('_.has Error, params:', obj, key);
            throw ex;
        });
    }
    return r;
};

/**
 * Executes function or gets value from cache.
 * @returns {*} result of function directly and via callback if specified
 * @param {string} key - unique cache key
 * @param {function} fn - function to execute to get the value if it is not already cached.
 *      This functions first param should be a callback to execute with result value if its async.
 * @param {object} [ops=undefined] - pass null, undefined, or {} to use default
 * @param {*} [ops.defaultOnFail=undefined] - default value to return if function execution results in error
 *      Note: if result is undefined, it won't be cached
 * @param {bool} [ops.recheck=false] - pass true to execute even if already cached (will update cache with new execution result)
 * @param {function} [cb] - callback to execute when done.
 *      If this is specified, then the result will be undefined and it must be obtained via the callback.
 *      The passed functions first param should be its callback function to execute when done that will receive the result
 *
 * @browser only
 *
 * @example (async)
 *
 *   _.cache('key', function(cb) {
 *       //do some async operation, call cb when done
 *       cb('asyncResult');
 *   }, {}, function(result) {
 *       //result = 'asyncResult'
 *   });
 *
 */
_.cache = function(key, fn, ops, cb) {
    //get/setup global cache
    var k = '__usCache';
    if (window[k] === undefined) window[k] = {};
    var c = window[k];

    //set params (note: not using _.mergeDefault for performance)
    if (ops == null) ops = {};
    var defaultOnFail = ops.defaultOnFail,
        recheck = ops.recheck,
        async = typeof cb === 'function';

    //use existing value if already cached
    if (!recheck && c[key] !== undefined) {
        if (async) {
            cb(c[key]);
            return;
        }
        return c[key];
    }

    //do async
    if (async) {
        try {
            fn(function(result) {
                c[key] = result;
                cb(result);
            });
        }
        catch (ex) {
            c[key] = defaultOnFail;
            cb(defaultOnFail);
        }
        return;
    }

    //do sync
    try {
        c[key] = fn();
    }
    catch (ex) {
        c[key] = defaultOnFail;
    }
    return c[key];
};

/**
 * deletes cached data at given key
 * @param {string} key - unique cache key
 */
_.cacheDelete = function(key) {
    //get/setup global cache
    var k = '__usCache';
    if (window[k] === undefined) window[k] = {};
    var c = window[k];

    delete k[key];
};

/**
 * @returns {bool} true if an object is present at given cache key (objects value must not ben undefined)
 * @param {string} key - unique cache key
 */
_.cacheExists = function(key) {
    //get/setup global cache
    var k = '__usCache';
    if (window[k] === undefined) window[k] = {};
    var c = window[k];

    return c[key] !== undefined;
};

/**
 * @returns {int} number of times count has been called for passed key (first call for the key returns 1)
 * @param {string} key - key to check for
 * @param {int} [ops.clearAfter=-1] - duration in milliseconds to clear the count for this key or -1 to not clear (must be > 0 to clear)
 *      note: this doesn't set a timer to clear, instead the count is cleared on the next call if the clearAfter time has been exceeded.
 *            this allows for better performance as clearing is only done as needed
 *      note: clearAfter is only set on the FIRST call, so subsequent calls with the same key wont update clearAfter (TODO: can change this if needed with an option)
 */
_.count = function(key, ops) {
    var k = '__usCountCache';
    if (window[k] === undefined) window[k] = {};
    var c = window[k];

    //set params (note: not using _.mergeDefault for performance)
    if (ops == null) ops = {};
    var clearAfter = _.toInt(ops.clearAfter);


    if (clearAfter > 0) {
        var d = new Date();
        d.setMilliseconds(d.getMilliseconds() + clearAfter);
        clearAfter = d.getTime();
    }


    /**
     * Inserts cache w/ count 1 and returns 1.
     * Call when inserting new cache or resetting due to clear after being surpassed
     */
    var insertCache = function() {
        c[key] = {
            count: 1,
            clearAfter: clearAfter
        };
        return 1;
    };


    if (c[key] === undefined) {
        return insertCache();
    }
    else {
        //key already inserted, get from cache
        var obj = c[key];
        if (obj.clearAfter > 0 && new Date().getTime() > obj.clearAfter) {
            return insertCache(); //clear cache due to clearAfter being reached
        }

        r = obj.count + 1;
        obj.count++;
        c[key] = obj;
        return r;
    }
};

/**
 * @returns {string} creates a key by converting each passed argument to a string and separting by underscore [_]
 * use to easily create unique key for memoizing a function
 * @param {*} n1 - pass as many args are desired
 * @note this uses _.toStr which will automatically strigify complex objects, which can be slow
 * @note not thorougly tested
 */
_.key = function(n1, n2, n3, n4) {
    var r = '';
    var args = Array.prototype.slice.call(arguments, 0);
    for (var i = 0; i < args.length; i++) {
        r += '_' + _.toStr(args[i], '', true);
    }
    return r;
};

/**
 * generates random string using letters and numbers
 * @param {int} len - length of generated string
 * @param {string} [chartList] - characters used to generate string, leave default for
 */
_.genRandomString = function(len, charList) {
    /**
     * @returns {int} random number between min (included) and max (excluded)
     * from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random     *
     */
    var randomNum = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    if (_.empty(charList)) { //default doesnt include I|L|1|0|O
        charList = 'ABCDEFGHJKMNPQRSTUVWZYZabcdefghjkmnpqrstuvwxyz23456789';
    }
    var charListLen = charList.length;

    var r = '';
    for (var i = 0; i < len; i++) {
        r += charList[randomNum(0, charListLen)];
    }
    return r;
};

/**
 * string maniuplation functions copied from [underscore.string](http://epeli.github.io/underscore.string/) (only copied the ones I want to use)
 */
_.s = {
        /**
         * @returns {bool} true if pass strings are equal (case insensitive) after trimming end white space
         * @param {string} str1
         * @param {string} str2
         * @param {bool} [noTrim=false] - pass true to compare strings without first trimming end white space
         */
        equalsNoCase: function(str1, str2, noTrim) {
            str1 = _.toStr(str1).toLowerCase();
            str2 = _.toStr(str2).toLowerCase();
            if (!noTrim) {
                //3.8.2019: replace char code 160 (non breaking space, which looks exactly like a space) with space before trimming
                str1 = _.replaceAll(str1, String.fromCharCode(160), ' ').trim();
                str2 = _.replaceAll(str2, String.fromCharCode(160), ' ').trim();
            }
            return str1 === str2;
        },

        /**
         * @returns {bool} true if pass strings are equal after trimming end white space
         * @param {string} str1
         * @param {string} str2
         */
        equals: function(str1, str2) {
            return str1.trim() === str2.trim();
        },

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
         * Only encodes < and > to corresponding character references (same as .NET HtmEncode)
         * USE htmlEnoceAll to encode all html characters!
         * @param {string} str - string to encode
         * @param {bool} [singleQuote=false] - pass ture to encode single quote as &#39;
         */
        htmlEncode: function(str, singleQuote) {
            //http://stackoverflow.com/a/4318199/1571103
            //note: decided to use character entity references instead of numberic character references to mach .NET HtmlEncode method (except.NET method uses &#39 for single quote, so I am too..)

            var entityMap = {
                // "<": "&#60;",
                // ">": "&#62;",
                "<": "&lt;",
                ">": "&gt;",
            };
            //todo: clean this up (made a mess when adding double quote)
            var re = /[<>]/g;
            if (singleQuote) {
                entityMap["'"] = "&#39;";
                re = /[<>']/g;
            }

            return String(str).replace(re, function(s) {
                if (!s) return '';
                return entityMap[s];
            });
        },

        /**
         * @returns {string} html encoded string
         * encodes all html charcters (<,>,&,",')  (less than, greater than, ampersand, double quote, single quote)
         * @param {string} str - string to encode
         */
        htmlEncodeAll: function(str) {
            //http://stackoverflow.com/a/4318199/1571103
            //note: decided to use character entity references instead of numberic character references to mach .NET HtmlEncode method (except.NET method uses &#39 for single quote, so I am too..)

            // .NET HtmlAttributeEncode         http://referencesource.microsoft.com/#System.Web/Util/HttpEncoder.cs,46e7e533003d74d8
            // .NET HtmlEncode                  http://referencesource.microsoft.com/#System/net/System/Net/WebUtility.cs,f0f99ddd66f61359
            // difference: html encode only encodes double quote, single quote, ampersand, and less than; html attribute encode also includes greater than

            var entityMap = {
                "<": "&lt;",
                ">": "&gt;",
                "&": "&amp;",
                "'": "&#39;",
                "\"": "&quot;",
            };
            var re = /[<>'"]/g; //override above

            return String(str).replace(re, function(s) {
                if (!s) return '';
                return entityMap[s];
            });
        },

        /**
         * @returns {string} string with  html line breaks [<br/>] replaced with [\n]
         * @param {string} str
         */
        htmlBreakToNewLine: function(str) {
            return str.replace(/< ?br ?\/? ?>/gi, '\n');
        },

        /**
         * @returns {string} string with standard newline [\n] and tab [\t] (or 4x spaces) replaces with html line breaks [<br/>] and html spaces [&nbsp;]
         * @param {string} str
         */
        toHtml: function(str) {
            return str.replace(/\n/gi, '<br/>').replace(/\t/gi, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/    /gi, '&nbsp;&nbsp;&nbsp;&nbsp;');
        },

        /**
         * @returns {string} string with html line breaks [<br/> and html spaces [&nbsp;] replaced with standard newline [\n] and space
         * @param {string} str
         * @note current does not support output of tab character [\t]
         */
        toNotHtml: function(str) {
            return str.replace(/<br\/>/gi, '\n').replace(/&nbsp;/gi, ' ');
        },

        /**
         * @returns {string} passed string stripped of html tags
         * @param {string} str
         */
        removeHtml: function(str) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = str;
            tmp = tmp.textContent || tmp.innerText || "";
            //3.8.2019: if a '&nbsp;' was in the HTML it will get converted into char 160, which looks like whitespace but its actually not (can be very confusing!). Replace any of these with a normal space.
            tmp = _.replaceAll(tmp, String.fromCharCode(160), ' ');
            return tmp;
        },

        /**
         * trims passed string to max length and shows trailing dots if trimmed
         * @param {string} str - string to trim
         * @param {int} maxLength - max length of string (incuding dots)
         * @param {bool} [showDots=true] - if trailing dots should be shown if string is trimmed
         * @param {bool} [trimLeft=false] - pass true to trim from left side instead of right side
         * @param {bool} [dotsAfterMax=false] - if true, adding trailing dots if trimmed wont count towards max length (which will make max length 2 chars longer than expected)
         */
        trimLength: function(str, maxLength, showDots, trimLeft, dotsAfterMax) {
            //if (_.empty(str)) return str;
            maxLength = _.toInt(maxLength);
            if (maxLength < 0) throw new RangeError('maxLength must be greater than or equal to zero: ' + maxLength);

            var strLength = str.length,
                count = Math.min(strLength, maxLength),
                r = trimLeft ? str.slice(-1 * count) : str.substr(0, count);

            //cant show dots if maxLength is less than 3 as result would only be dots...
            if (showDots !== false && (dotsAfterMax || maxLength > 2) && strLength > maxLength) {
                if (trimLeft) r = '..' + (dotsAfterMax ? r : r.substr(2));
                else r = (dotsAfterMax ? r : r.substr(0, r.length - 2)) + '..';
            }
            return r;
        },

        /**
         * for debugging: transforms whitespace characters (line breaks, tabs, and 2 or more concurrent spaces) into characters that can be read
         * @param {string} str - string to trim
         */
        showWhiteSpace: function(str) {
            if (str == null) return str;

            if (str == " ") {
                //special case: if string is exactly one space, then convert it to a value that shows us this
                return "[1space]";
            }

            //note: order of replacments is important
            str = _.replaceAll(str, "\r\n", "[/r/n]");
            str = _.replaceAll(str, "\r", "[/r]"); //there can be a standalone /r
            str = _.replaceAll(str, "\n", "[/n]");
            str = _.replaceAll(str, "\t", "[/t]");
            str = _.replaceAll(str, "  ", "[2space]");
            //non breaking space (char 160) doesnt match space and can be very confusing becuase its hard to visualize!
            str = _.replaceAll(str, String.fromCharCode(160), "[NoBrSpace]");
            return str;
        }
    },

    (function() {
        //this will error if lodash is not included
        try {
            var cache;
            var browserInfo = function() {
                var sf = this;
                var getIeVersion = function() {
                    if (!sf.isIE) return 999;
                    // IE7: "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)"
                    // IE8: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)"
                    // IE9: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)"
                    // IE10:"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)"
                    // IE11:"Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; rv:11.0) like Gecko"
                    if (sf.ua.indexOf('msie') !== -1) return parseInt(sf.ua.split('msie')[1]);
                    else return parseInt(sf.ua.split('rv:')[1]);

                    if (isNaN(sf.ieVersion)) {
                        setTimeout(function() {
                            throw new Error('failed to parse IE version. This function only supports IE 7 to 11, if a new vesion of IE came out then this needs to be updated');
                        }, 1);
                        return 999; //set to max as a new version of IE likely wont be an issue
                    }
                };
                /** @type {string] lowercase userAgent */
                this.ua = navigator.userAgent.toLowerCase();
                /** @type {bool} indicates if browser is IE */
                this.isIE = this.ua.indexOf('trident') !== -1;
                /** @type {bool} indicates if browser is microsoft Edge */
                this.isEdge = this.ua.indexOf('edge/') !== -1;
                /** @type {int} version of IE or 999 if not IE, this allows for simply check for like: if(ieVersion<9) */
                this.ieVersion = getIeVersion();
                /**
                 * gets mouse button clicked from event (normalizes < ie9 which had silly buttons)
                 * @returns {string} one of the following: left,right,middle
                 * @param {int} number - event.button from click event that has button number
                 * @param {bool} [isJqueryNormalized=false] - if true, this will assume jquery alraedy normalized to http://api.jquery.com/event.which/
                 */
                this.mouseBtn = function(num, isJqueryNormalized) {
                    num = parseInt(num);
                    if (isNaN(num)) throw new TypeError('passed parameter `num` is not a number: ' + num + ';\n Its likely that the getButton (default or custom) function needs to be fixed if this was called using _.handleclick');

                    var r = {
                        Left: 'left',
                        Right: 'right',
                        Middle: 'middle'
                    };
                    if (isJqueryNormalized) {
                        if (num === 1) return r.Left;
                        else if (num === 2) return r.Middle;
                        else if (num === 3) return r.Right;
                        else if (num === 0) {
                            //TODO: this is here becuase touch screens appear to result in 0, but i'm not completely sure if this is meant to be the case and if it is consistent
                            return r.Left;
                        }
                        else throw new Error('invalid number passed for mouse click event: ' + num);
                    }
                    else {
                        if (sf.ieVersion > 8) {
                            if (num === 0) return r.Left;
                            else if (num === 1) return r.Middle;
                            else if (num === 2) return r.Right;
                            else throw new Error('invalid number passed for mouse click event: ' + num);
                        }
                        //IE8 or earlier
                        if (num === 1) return r.Left;
                        else if (num === 4) return r.Middle;
                        else if (num === 2) return r.Right;
                        else throw new Error('invalid number passed for mouse click event: ' + num);
                    }
                };
            };
            /**
             * @returns {browserInfo}
             * @note currently this only used to detect IE version
             * @note This function is only executed once (on first call) for performance
             */
            _.browser = function() {
                if (!cache) cache = new browserInfo();
                return cache;
            };
        }
        catch (ex) {
            setTimeout(function() {
                console.log('error in _.browser');
                throw ex;
            }, 0);
        }
    })();

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
