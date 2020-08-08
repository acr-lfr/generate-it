"use strict";
exports.__esModule = true;
exports.cli = exports.flatten = exports.fmtString = exports.fmtProp = exports.yamlToExpect = exports.yamlToJson = void 0;
var tslib_1 = require("tslib");
var path_1 = require("path");
var fs_1 = require("fs");
var js_yaml_1 = require("js-yaml");
/**
 * Parse a YAML file into nested JSON
 */
exports.yamlToJson = function (yamlFilePath) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var exists, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!yamlFilePath) {
                    throw new Error('No file path given');
                }
                return [4 /*yield*/, fs_1.promises.access(yamlFilePath).then(function () { return true; })["catch"](function () { return false; })];
            case 1:
                exists = _b.sent();
                if (!exists) {
                    throw new Error("Could not find YAML file '" + yamlFilePath + "'");
                }
                _a = js_yaml_1.safeLoad;
                return [4 /*yield*/, fs_1.promises.readFile(yamlFilePath, 'utf8')];
            case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    });
}); };
/**
 * Parse a YAML file into a newline-delimited block of expects (usually
 * for outputting to stdout)
 */
exports.yamlToExpect = function (yamlFilePath) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var json, formatted, expects;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.yamlToJson(yamlFilePath)];
            case 1:
                json = _a.sent();
                formatted = exports.flatten(json);
                expects = Object.entries(formatted).reduce(function (expectLines, _a) {
                    var key = _a[0], value = _a[1];
                    return expectLines.concat("expect(itemToTest." + key + ").toBe(" + value + ");");
                }, []);
                return [2 /*return*/, expects.join('\n')];
        }
    });
}); };
/**
 * Format object properties
 * eg:
 *   prop is "variable like"
 *   => test.variableLike.something
 *   prop is numeric
 *   => test[200].something
 *   otherwise
 *   => test['thing-with/non-variable or numeric'].something
 */
exports.fmtProp = function (prop) {
    if (/^[a-zA-Z\$][a-zA-Z\$0-9_]*$/.test(prop)) {
        return "." + prop;
    }
    if (/^[0-9]+$/.test(prop)) {
        return "[" + prop + "]";
    }
    return "['" + prop + "']";
};
/**
 * Deal with quoting
 * Check if the value does not contain a particular string type ['"`] and
 * use that, or use escaped value
 *   'thing', "thing's thing", `"A quote 'n stuff"`
 */
exports.fmtString = function (value) {
    if (typeof value === 'string') {
        var quote = void 0;
        if (!/'/.test(value)) {
            quote = "'";
        }
        else if (!/"/.test(value)) {
            quote = '"';
        }
        else if (!/`/.test(value)) {
            quote = '`';
        }
        else {
            quote = "'";
            value = value.replace(/'/g, "\\'");
        }
        value = "" + quote + value + quote;
    }
    return value;
};
/**
 * Turn nested json into flattened accessors
 * https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
 *
 * eg:
 *   {
 *     thing: {
 *       one: 'two'
 *     },
 *     arr: [{ one: 1 }, { two: 2 }]
 *   }
 *
 * becomes:
 *   {
 *     'thing.one' : 'two',
 *     'arr[0].one': 1,
 *     'arr[1].two': 2
 *   }
 */
exports.flatten = function (data) {
    var result = {};
    var recurse = function (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = exports.fmtString(cur);
        }
        else if (Array.isArray(cur)) {
            var l = cur.length;
            for (var i = 0; i < l; i++) {
                recurse(cur[i], prop ? prop + exports.fmtProp(i) : '' + i);
                l = cur.length;
            }
            if (l === 0) {
                result[prop] = [];
            }
        }
        else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + exports.fmtProp(p) : p);
            }
            if (isEmpty) {
                result[prop] = {};
            }
        }
    };
    recurse(data, '');
    return result;
};
/**
 * Accept command-line arguments
 *
 * node build/src/__tests__/helpers/yaml-to-json.js path/to/test.yml
 */
exports.cli = function () {
    var input = process.argv[2];
    if (!input) {
        console.error("usage: " + path_1.basename(process.argv[1]) + " inputYaml");
        process.exit(1);
    }
    var fullInPath = path_1.join(process.cwd(), input || '');
    return exports.yamlToExpect(fullInPath)
        .then(function (lines) {
        console.log(lines);
        process.exit(0);
    })["catch"](function (err) {
        console.trace(err);
        process.exit(1);
    });
};
if (require.main === module) {
    exports.cli();
}
