"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var endpointNameCalculation_1 = tslib_1.__importDefault(require("../endpointNameCalculation"));
it('should return the 1st segment only for no count passed', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var endpoint;
    return tslib_1.__generator(this, function (_a) {
        endpoint = endpointNameCalculation_1["default"]('/item/{id}', {});
        expect(endpoint).toBe('item');
        return [2 /*return*/];
    });
}); });
it('should return the 1st segment only when the count 2  & only 2 path segments', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var endpoint;
    return tslib_1.__generator(this, function (_a) {
        endpoint = endpointNameCalculation_1["default"]('/item/{id}', {
            segmentFirstGrouping: 2
        });
        expect(endpoint).toBe('item');
        return [2 /*return*/];
    });
}); });
it('should return the 1st segment only', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var endpoint;
    return tslib_1.__generator(this, function (_a) {
        endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment', {
            segmentFirstGrouping: 2
        });
        expect(endpoint).toBe('itemComment');
        return [2 /*return*/];
    });
}); });
it('should return itemComment', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var endpoint;
    return tslib_1.__generator(this, function (_a) {
        endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
            segmentFirstGrouping: 2
        });
        expect(endpoint).toBe('itemComment');
        return [2 /*return*/];
    });
}); });
it('should return itemThing', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var endpoint;
    return tslib_1.__generator(this, function (_a) {
        endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
            segmentFirstGrouping: 3
        });
        expect(endpoint).toBe('itemThing');
        return [2 /*return*/];
    });
}); });
it('should return itemId', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var endpoint;
    return tslib_1.__generator(this, function (_a) {
        endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
            segmentFirstGrouping: 1
        });
        expect(endpoint).toBe('itemId');
        return [2 /*return*/];
    });
}); });
