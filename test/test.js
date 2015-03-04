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
        assert.ok(Object.equals(actual, expected), 'test: ' + name + '; ' + 'result:' + _.toStr(actual, '', true));
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
doEqual("empty array (using fast with array wont work!)", _.mergeDefault(defaultObject, []), defaultObject);
//#endregion

//#region invalidTypes
doEqual("string", _.mergeDefault(defaultObject, "string"), defaultObject);
doEqual("number", _.mergeDefault(defaultObject, 7), defaultObject);

doEqual("array (using fast with array wont work!)", _.mergeDefault(defaultObject, [3, 2]), defaultObject);
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


QUnit.test("_.has", function(assert) {
    var noProp = 'noPropertyAtThisKey';
    var Class1 = function() {
        this.definedProp = 'defined';
        this.nullProp = null;
        this.undefinedProp = undefined;
    };
    Class1.prototype.p_definedProp = 'defined';
    Class1.prototype.p_nullProp = null;
    Class1.prototype.p_undefinedProp = undefined;

    var Class2 = function() {};
    Class2.prototype.inherited_definedProp = 'defined';
    Class2.prototype.inherited_nullProp = null;
    Class2.prototype.inherited_undefinedProp = undefined;

    for (var k in Class2.prototype) {
        Class1.prototype[k] = Class2.prototype[k];
    }

    var c = new Class1();
    console.log('Class1 Instance:', c);

    var t = function(key, expected, skipProto, skipUndefined) {
        var m = 'has key: `' + key + '` = ' + expected;
        if (skipProto) m += ' [skipProto]';
        if (skipUndefined) m += ' [skipUndefined]';
        assert.equal(_.has(c, key, skipProto, skipUndefined), expected, m);
    };

    //defaultParams
    t('defaultParams', false);
    t('definedProp', true);
    t('nullProp', true);
    t('undefinedProp', true);

    t('p_definedProp', true);
    t('p_nullProp', true);
    t('p_undefinedProp', true);

    t('inherited_definedProp', true);
    t('inherited_nullProp', true);
    t('inherited_undefinedProp', true);

    //skipProto
    t('defaultParams', false, true);
    t('definedProp', true, true);
    t('nullProp', true, true);
    t('undefinedProp', true, true);

    t('p_definedProp', false, true);
    t('p_nullProp', false, true);
    t('p_undefinedProp', false, true);

    t('inherited_definedProp', false, true);
    t('inherited_nullProp', false, true);
    t('inherited_undefinedProp', false, true);

    //skipUndefined
    t('defaultParams', false, false, true);
    t('definedProp', true, false, true);
    t('nullProp', true, false, true);
    t('undefinedProp', false, false, true);

    t('p_definedProp', true, false, true);
    t('p_nullProp', true, false, true);
    t('p_undefinedProp', false, false, true);

    t('inherited_definedProp', true, false, true);
    t('inherited_nullProp', true, false, true);
    t('inherited_undefinedProp', false, false, true);


});


QUnit.test("_.cache", function(assert) {
    var r = _.cache('1', function() {
        return 1;
    });
    assert.equal(r, 1, 'normal');

    _.cache('2', function(cb) {
        cb(2);
    }, null, function(result) {
        console.log('entered result');
        assert.equal(result, 2, 'async');
    });


    // _.cache('key', function(cb) {
    //     //do some async operation, call cb when done
    //     cb('asyncResult');
    // }, {}, function(result) {
    //     //result = 'asyncResult'
    // });

});
