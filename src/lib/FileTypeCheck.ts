class FileTypeCheck {
  public OPERATION = 'OPERATION';
  public OPERATION_INDEX = 'OPERATION_INDEX';
  public INTERFACE = 'INTERFACE';
  public MOCK = 'MOCK';
  public STUB = 'STUB';
  public OTHER = 'OTHER';

  public getFileType(name: string) {
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

  public isOpertationFile(name: string) {
    return name.substr(0, 5) === '___op';
  }

  public isOpertationIndexFile(name: string) {
    return name.substr(0, 10) === '___opIndex';
  }

  public isMockFile(name: string) {
    return name.substr(0, 7) === '___mock';
  }

  public isStubFile(name: string) {
    return name.substr(0, 7) === '___stub';
  }

  public isInterfaceFile(name: string) {
    return name.substr(0, 12) === '___interface';
  }
}

export default new FileTypeCheck();
