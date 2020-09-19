class ApiIs {
  swagger(apiObject: any) {
    return !!(
      (apiObject.swagger && apiObject.swagger[0] === '2') ||
      (apiObject.openapi && apiObject.openapi[0] === '2')
    );
  }

  openapi2(apiObject: any) {
    return this.swagger(apiObject);
  }

  openapi3(apiObject: any) {
    return !!(apiObject.openapi && apiObject.openapi[0] === '3');
  }

  isOpenAPIorSwagger(apiObject: any) {
    return this.openapi3(apiObject) || this.openapi2(apiObject) || this.swagger(apiObject);
  }

  asyncapi2(apiObject: any) {
    return !!(apiObject.asyncapi && apiObject.asyncapi[0] === '2');
  }
}

export default new ApiIs();
