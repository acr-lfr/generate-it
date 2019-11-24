"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FileTypeCheck {
    constructor() {
        this.OPERATION = 'OPERATION';
        this.OPERATION_INDEX = 'OPERATION_INDEX';
        this.INTERFACE = 'INTERFACE';
        this.MOCK = 'MOCK';
        this.STUB = 'STUB';
        this.OTHER = 'OTHER';
    }
    getFileType(name) {
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
    }
    isOpertationFile(name) {
        return name.substr(0, 5) === '___op';
    }
    isOpertationIndexFile(name) {
        return name.substr(0, 10) === '___opIndex';
    }
    isMockFile(name) {
        return name.substr(0, 7) === '___mock';
    }
    isStubFile(name) {
        return name.substr(0, 7) === '___stub';
    }
    isInterfaceFile(name) {
        return name.substr(0, 12) === '___interface';
    }
}
exports.default = new FileTypeCheck();
//# sourceMappingURL=FileTypeCheck.js.map