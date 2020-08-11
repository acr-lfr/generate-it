"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var checkRcOpIdArrIsValid_1 = tslib_1.__importDefault(require("../checkRcOpIdArrIsValid"));
var nodegenRc = {
    nodegenDir: 'blah',
    nodegenType: 'blah',
    helpers: {
        publishOpIds: ['bob'],
        subscribeOpIds: ['smith']
    }
};
var openapi = {
    'paths': {}
};
var asyncapi = {
    channels: {
        somepath: {
            publish: {
                operationId: 'bob'
            }
        },
        someotherpath: {
            subscribe: {
                operationId: 'smith'
            }
        }
    }
};
it('should not throw an error for openapi', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        checkRcOpIdArrIsValid_1["default"](openapi, nodegenRc);
        done();
        return [2 /*return*/];
    });
}); });
it('should not throw an error for asyncapi', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        checkRcOpIdArrIsValid_1["default"](asyncapi, nodegenRc);
        done();
        return [2 /*return*/];
    });
}); });
it('should throw an error for asyncapi with invalid subscribe id', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        nodegenRc.helpers.subscribeOpIds.push('timmy');
        try {
            checkRcOpIdArrIsValid_1["default"](asyncapi, nodegenRc);
            done('should have errored');
        }
        catch (e) {
            nodegenRc.helpers.subscribeOpIds.pop();
            done();
        }
        return [2 /*return*/];
    });
}); });
it('should throw an error for asyncapi with invalid publish id', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        nodegenRc.helpers.publishOpIds.push('timmy');
        try {
            checkRcOpIdArrIsValid_1["default"](asyncapi, nodegenRc);
            done('should have errored');
        }
        catch (e) {
            nodegenRc.helpers.publishOpIds.pop();
            done();
        }
        return [2 /*return*/];
    });
}); });
it('should throw an error for asyncapi with any duplicate id', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        nodegenRc.helpers.publishOpIds.push('smith');
        try {
            checkRcOpIdArrIsValid_1["default"](asyncapi, nodegenRc);
            done('should have errored');
        }
        catch (e) {
            nodegenRc.helpers.publishOpIds.pop();
            done();
        }
        nodegenRc.helpers.subscribeOpIds.push('bob');
        try {
            checkRcOpIdArrIsValid_1["default"](asyncapi, nodegenRc);
            done('should have errored');
        }
        catch (e) {
            nodegenRc.helpers.publishOpIds.pop();
            done();
        }
        return [2 /*return*/];
    });
}); });
