"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var getOpIdsFromAsyncApi_1 = tslib_1.__importDefault(require("./getOpIdsFromAsyncApi"));
exports["default"] = (function (apiObject, nodegenRc) {
    var _a, _b, _c, _d;
    if (!apiObject.channels) {
        return true;
    }
    var ids = {
        publish: [],
        subscribe: []
    };
    (_b = (_a = nodegenRc.helpers) === null || _a === void 0 ? void 0 : _a.subscribeOpIds) === null || _b === void 0 ? void 0 : _b.forEach(function (item) {
        if (!ids.subscribe.includes(item)) {
            ids.subscribe.push(item);
        }
        else {
            throw new Error('The nodegenrc file contains duplicate subscribeOpIds');
        }
    });
    (_d = (_c = nodegenRc.helpers) === null || _c === void 0 ? void 0 : _c.publishOpIds) === null || _d === void 0 ? void 0 : _d.forEach(function (item) {
        if (!ids.publish.includes(item)) {
            ids.publish.push(item);
        }
        else {
            throw new Error('The nodegenrc file contains duplicate publishOpIds');
        }
    });
    var idsToCompare = getOpIdsFromAsyncApi_1["default"](apiObject);
    ids.publish.forEach(function (id) {
        if (!idsToCompare.publish.includes(id)) {
            throw new Error('The nodegenrc file wants to PUBLISH to an id that does not exists in the async api file provided: ' + id);
        }
    });
    ids.subscribe.forEach(function (id) {
        if (!idsToCompare.subscribe.includes(id)) {
            throw new Error('The nodegenrc file wants to SUBSCRIBE to an id that does not exists in the async api file provided: ' + id);
        }
    });
});
