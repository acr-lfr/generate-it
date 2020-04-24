"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var getSingleSuccessResponse_1 = tslib_1.__importDefault(require("../getSingleSuccessResponse"));
var responseObject = {
    description: 'description',
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'id' },
            text: { type: 'string', description: 'text' },
            url: { type: 'string', description: 'url' }
        }
    }
};
var buildResponses = function (codes) {
    return (codes || []).reduce(function (responses, code) {
        var _a;
        return Object.assign(responses, (_a = {},
            _a[typeof code === 'number' ? code : "" + code] = responseObject,
            _a));
    }, {});
};
var asStrings = function (codes) { return (codes || []).map(String); };
describe('getSingleSuccessResponse helper', function () {
    it('can extract 200-level codes', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var testCodes, apiObj, responseCode;
        return tslib_1.__generator(this, function (_a) {
            testCodes = [
                [100, 200, 300, 400, 500],
                [100, 201, 300, 400, 500],
                [202, 500],
                [203],
                [204],
                [205, 100],
                [500, 206],
            ];
            apiObj = buildResponses(testCodes[0]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(200);
            apiObj = buildResponses(asStrings(testCodes[0]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(200);
            apiObj = buildResponses(testCodes[1]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(201);
            apiObj = buildResponses(asStrings(testCodes[1]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(201);
            apiObj = buildResponses(testCodes[2]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(202);
            apiObj = buildResponses(asStrings(testCodes[2]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(202);
            apiObj = buildResponses(testCodes[3]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(203);
            apiObj = buildResponses(asStrings(testCodes[3]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(203);
            apiObj = buildResponses(testCodes[4]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(204);
            apiObj = buildResponses(asStrings(testCodes[4]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(204);
            apiObj = buildResponses(testCodes[5]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(205);
            apiObj = buildResponses(asStrings(testCodes[5]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(205);
            apiObj = buildResponses(testCodes[6]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(206);
            apiObj = buildResponses(asStrings(testCodes[6]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(206);
            return [2 /*return*/];
        });
    }); });
    it('returns nothing when there are multiple 200-level codes', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var testCodes, apiObj, responseCode;
        return tslib_1.__generator(this, function (_a) {
            testCodes = [
                [100, 200, 201, 300, 400, 500],
                [100, 201, 202, 300, 400, 500],
                [202, 203, 500],
                [203, 204],
                [204, 205],
                [205, 204],
                [206, 205, 100],
                [500, 418, 200, 206],
            ];
            apiObj = buildResponses(testCodes[0]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[0]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[1]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[1]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[2]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[2]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[3]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[3]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[4]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[4]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[5]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[5]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[6]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[6]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[7]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[7]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            return [2 /*return*/];
        });
    }); });
    it('returns nothing when there are no 200-level codes', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var testCodes, apiObj, responseCode;
        return tslib_1.__generator(this, function (_a) {
            testCodes = [
                [100, 300, 400, 500],
                [100, 300, 400, 500],
                [418, 500],
                [100, 301, 422, 512],
                [503, 418, 100],
                [],
            ];
            apiObj = buildResponses(testCodes[0]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[0]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[1]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[1]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[2]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[2]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[3]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[3]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[4]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[4]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(testCodes[5]);
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            apiObj = buildResponses(asStrings(testCodes[5]));
            responseCode = getSingleSuccessResponse_1["default"](apiObj);
            expect(responseCode).toBe(undefined);
            return [2 /*return*/];
        });
    }); });
});
