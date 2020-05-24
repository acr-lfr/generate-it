"use strict";
exports.__esModule = true;
exports.clearTestServer = exports.tplClientServer = exports.tplUrl = void 0;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
exports.tplUrl = 'https://github.com/acrontum/openapi-nodegen-typescript-server.git';
exports.tplClientServer = 'https://github.com/acrontum/openapi-nodegen-typescript-server-client.git';
exports.clearTestServer = function (dir) {
    if (dir === void 0) { dir = 'test_server'; }
    // return;
    var names = fs_extra_1["default"].readdirSync(path_1["default"].join(process.cwd(), dir));
    for (var i = 0; i < names.length; ++i) {
        if (names[i] !== '.openapi-nodegen') {
            fs_extra_1["default"].removeSync(path_1["default"].join(process.cwd(), dir, names[i]));
        }
    }
    var compare = path_1["default"].join(process.cwd(), dir, '/.openapi-nodegen/cache');
    if (fs_extra_1["default"].pathExistsSync(compare)) {
        fs_extra_1["default"].removeSync(compare);
    }
};
