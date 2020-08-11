"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var endpointNameCalculation_1 = tslib_1.__importDefault(require("../endpointNameCalculation"));
describe('no grouping', function () {
    it('should return root for /', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/', {});
            expect(endpoint).toBe('root');
            return [2 /*return*/];
        });
    }); });
    it('should fix path without leading /', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('item', {});
            expect(endpoint).toBe('item');
            return [2 /*return*/];
        });
    }); });
    it('should return the 1st segment only for no count passed', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item', {});
            expect(endpoint).toBe('item');
            return [2 /*return*/];
        });
    }); });
    it('should return the 1st segment only for no count passed', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/', {});
            expect(endpoint).toBe('item');
            return [2 /*return*/];
        });
    }); });
    it('should return the 1st segment only for no count passed', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}', {});
            expect(endpoint).toBe('item');
            return [2 /*return*/];
        });
    }); });
    it('should return the 1st segment only for no count passed', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment', {});
            expect(endpoint).toBe('item');
            return [2 /*return*/];
        });
    }); });
});
describe('1st grouping only', function () {
    it('should return the 1st segment only as 1st grouping is 0', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}', {
                segmentFirstGrouping: 0
            });
            expect(endpoint).toBe('item');
            return [2 /*return*/];
        });
    }); });
    it('should return the 1st & 2nd segment', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}', {
                segmentFirstGrouping: 1
            });
            expect(endpoint).toBe('itemId');
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
    it('should return itemComment and not the remaining segments', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
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
});
describe('1st and 2nd grouping', function () {
    it('should throw error when 1st is >= to 2nd', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            try {
                endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
                    segmentFirstGrouping: 2,
                    segmentSecondGrouping: 2
                });
                done('The 1st is equal to the 2nd');
            }
            catch (e) {
                try {
                    endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
                        segmentFirstGrouping: 3,
                        segmentSecondGrouping: 2
                    });
                    done('The 1st is greater than the 2nd');
                }
                catch (e) {
                    done();
                }
            }
            return [2 /*return*/];
        });
    }); });
    it('should return itemComment as the 1st grouping is 0 the same as the base segment', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
                segmentFirstGrouping: 0,
                segmentSecondGrouping: 2
            });
            expect(endpoint).toBe('itemComment');
            return [2 /*return*/];
        });
    }); });
    it('should return itemIdComment', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
                segmentFirstGrouping: 1,
                segmentSecondGrouping: 2
            });
            expect(endpoint).toBe('itemIdComment');
            return [2 /*return*/];
        });
    }); });
    it('should return itemId', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment', {
                segmentFirstGrouping: 1,
                segmentSecondGrouping: 3
            });
            expect(endpoint).toBe('itemId');
            return [2 /*return*/];
        });
    }); });
    it('should return itemIdThing', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
                segmentFirstGrouping: 1,
                segmentSecondGrouping: 3
            });
            expect(endpoint).toBe('itemIdThing');
            return [2 /*return*/];
        });
    }); });
    it('should return itemIdThing', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var endpoint;
        return tslib_1.__generator(this, function (_a) {
            endpoint = endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
                segmentFirstGrouping: 2,
                segmentSecondGrouping: 3
            });
            expect(endpoint).toBe('itemCommentThing');
            return [2 /*return*/];
        });
    }); });
});
describe('2nd grouping only', function () {
    it('should throw an error', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            try {
                endpointNameCalculation_1["default"]('/item/{id}/comment/thing', {
                    segmentSecondGrouping: 2
                });
                done('Should have thrown an error when only passing segmentSecondGrouping with no segmentFirstGrouping');
            }
            catch (e) {
                done();
            }
            return [2 /*return*/];
        });
    }); });
});
