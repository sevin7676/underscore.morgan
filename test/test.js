/// <reference path="https://code.jquery.com/qunit/qunit-1.14.0.js"/>
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.compat.js"/>
/// <reference path="temp.js" />
/// <reference path="../underscore-addons.js" />

//NOTE: under-addons  ref is broken, also the temp.js one doesnt work- need to update caretTern to fix this

//documentation: http://qunitjs.com/cookbook/


//#region methods required to run tests
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
};

//returns assert.equal with message
function doEqual(name, actual, expected) {

    QUnit.test(name, function(assert) {
        assert.ok(Object.equals(actual, expected), 'test: ' + name + '; ' + 'result:' + _.toStr(actual));
    });
    // var p = null;
    // var d = defaultObject();
    // doEqual(assert,_.mergeDefault(d,p),d);
    // console.log('actual',actual);
    // console.log('expected',expected);
    // console.log('Object.doEqual(assert,(actual,expected)',Object.equals(actual,expected));
    //return assert.ok(Object.equals(actual, expected), 'result:' + _.toStr(actual));
    // return assert.equal(actual,expected,'result:' + _.toStr(actual));
    //assert.equal not working.. not sure why
}
//#endregion


//#region _.mergeDefault

var defaultObject = {
    a: "a"
};

//#region emptyTypes
doEqual('null', _.mergeDefault(defaultObject, null), defaultObject);
doEqual("undefined", _.mergeDefault(defaultObject, undefined), defaultObject);
doEqual("empty string", _.mergeDefault(defaultObject, ""), defaultObject);
doEqual("empty object", _.mergeDefault(defaultObject, {}), defaultObject);
doEqual("empty array", _.mergeDefault(defaultObject, [], true), defaultObject);
//#endregion

//#region invalidTypes
doEqual("string", _.mergeDefault(defaultObject, "string"), defaultObject);
doEqual("number", _.mergeDefault(defaultObject, 7), defaultObject);
doEqual("array", _.mergeDefault(defaultObject, [3,2], true), defaultObject);
doEqual("date", _.mergeDefault(defaultObject, new Date()), defaultObject);
//#endregion

//#region validTypes

var p = {
    b: "b"
};
var expected = {
    a: "a",
    //onClick: function(a) {},
    b: "b"
};
doEqual('extended object', _.mergeDefault(defaultObject, p), expected);

var p = {
    a: "c"
};
var expected = {
    a: "c",
    // onClick: function(a) {},
};
doEqual('extended object', _.mergeDefault(defaultObject, p), expected);

//#endregion

//#endregion


//#region _.s.encodeHtml

/**
 * test encode
 */
var tEnc = function(str) {
    var m1 = _.s.htmlEncode;
    var m2 = function(str) {
        return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
    };
    var r = '\n    ' + str;
    r += '\nm1: ' + m1(str);
    r += '\nm2: ' + m2(str);
    r += '\n\ndouble\n';
    r += '\nm1: ' + m1(m1(str));
    r += '\nm2: ' + m2(m2(str));
    console.log(r);
};
tEnc('<a href="#">link</a>');


//#endregion
