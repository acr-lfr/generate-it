"use strict";
exports.__esModule = true;
var FileTypeCheck = /** @class */ (function () {
    function FileTypeCheck() {
        this.OPERATION = 'OPERATION';
        this.OPERATION_INDEX = 'OPERATION_INDEX';
        this.INTERFACE = 'INTERFACE';
        this.MOCK = 'MOCK';
        this.STUB = 'STUB';
        this.OTHER = 'OTHER';
    }
    FileTypeCheck.prototype.getFileType = function (name) {
        if (this.isOpertationIndexFile(name)) {
            return this.OPERATION_INDEX;
        }
        if (this.isOpertationFile(name)) {
            return this.OPERATION;
        }
        if (this.isMockFile(name)) {
            return this.MOCK;
        }
        if (this.isStubFile(name)) {
            return this.STUB;
        }
        if (this.isInterfaceFile(name)) {
            return this.INTERFACE;
        }
        return this.OTHER;
    };
    FileTypeCheck.prototype.isOpertationFile = function (name) {
        return name.substr(0, 5) === '___op';
    };
    FileTypeCheck.prototype.isOpertationIndexFile = function (name) {
        return name.substr(0, 10) === '___opIndex';
    };
    FileTypeCheck.prototype.isMockFile = function (name) {
        return name.substr(0, 7) === '___mock';
    };
    FileTypeCheck.prototype.isStubFile = function (name) {
        return name.substr(0, 7) === '___stub';
    };
    FileTypeCheck.prototype.isInterfaceFile = function (name) {
        return name.substr(0, 12) === '___interface';
    };
    return FileTypeCheck;
}());
exports["default"] = new FileTypeCheck();
