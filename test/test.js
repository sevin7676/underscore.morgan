/// <reference path="https://code.jquery.com/qunit/qunit-1.14.0.js"/>
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.compat.js"/>
/// <reference path="temp.js" />
/// <reference path="../underscore-addons.js" />

//NOTE: under-addons  ref is broken, also the temp.js one doesnt work- need to update caretTern to fix this

//documentation: http://qunitjs.com/cookbook/

//#region _.mergeDefault

//default object for tests
function defaultObject() {
    return {
        a: "a",
        //onClick: function(a) {}
    };
}

//#region emptyTypes
QUnit.test("null", function(assert) {
    var p = null;
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
QUnit.test("undefined", function(assert) {
    var p = undefined;
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
QUnit.test("empty string", function(assert) {
    var p = "";
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
QUnit.test("empty object", function(assert) {
    var p = {};
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
QUnit.test("empty array", function(assert) {
    var p = [];
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
//#endregion

//#region invalidTypes
QUnit.test("string", function(assert) {
    var p = "string";
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
QUnit.test("number", function(assert) {
    var p = 7;
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
QUnit.test("array", function(assert) {
    var p = [3, 2];
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
QUnit.test("date", function(assert) {
    var p = new Date();
    var d = defaultObject();
    assert.equal(_.mergeDefault(d, p), d);
});
//#endregion

//#region validTypes
QUnit.test("extended object", function(assert) {
    var p = {
        b: "b"
    };
    var expected = {
        a: "a",
        //onClick: function(a) {},
        b: "b"
    };
    assert.ok(Object.equals(_.mergeDefault(defaultObject(), p), expected), JSON.stringify(_.mergeDefault(defaultObject(), p)));
});
QUnit.test("override default object", function(assert) {
    var p = {
        a: "c"
    };
    var expected = {
        a: "c",
        // onClick: function(a) {},
    };

    assert.ok(Object.equals(_.mergeDefault(defaultObject(), p), _.mergeDefault(defaultObject(), p)));
});
//#endregion


/*
QUnit.test("Is Object test", function(assert) {

    var parameter = {};
    assert.equal(), true, "Passed!");
});*/
//#endregion


//this one always returning true...
deepCompare = function() {
    //function deepCompare () {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on step when comparing prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') || (x instanceof Date && y instanceof Date) || (x instanceof RegExp && y instanceof RegExp) || (x instanceof String && y instanceof String) || (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good a we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object beeing a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof(x[p])) {
            case 'object':
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects(x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        throw new Error('arugments.length needs to be 2');
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }
    
    for (i = 1, l = arguments.length; i < l; i++) {
        leftChain = []; //Todo: this can be cached
        rightChain = [];
        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
};


//from http://stackoverflow.com/questions/1068834/object-comparison-in-javascript (not comprehensive but good enough for this test)
Object.equals = function(x, y) {
    if (x === y) return true;
    // if both x and y are null or undefined and exactly the same

    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

    if (x.constructor !== y.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for (var p in x) {
        if (!x.hasOwnProperty(p)) continue;
        // other properties were tested using x.constructor === y.constructor

        if (!y.hasOwnProperty(p)) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

        if (x[p] === y[p]) continue;
        // if they have the same strict value or identity then they are equal

        if (typeof(x[p]) !== "object") return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if (!Object.equals(x[p], y[p])) return false;
        // Objects and Arrays must be tested recursively
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}