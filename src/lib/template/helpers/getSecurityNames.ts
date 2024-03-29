import '@colors/colors';
/**
 * Extracts the security key names from a path object and returns as a tpl string or array
 * @param pathObject
 * @param fullSwaggerObject
 */
export default (pathObject: any, fullSwaggerObject: any): string => {
  if (!pathObject || !pathObject.security || pathObject.security.length === 0) {
    return '';
  }

  if (
    !fullSwaggerObject.securityDefinitions &&
    !(
      fullSwaggerObject.components &&
      fullSwaggerObject.components.securitySchemes
    )
  ) {
    console.error(`
    WARNING: A path object was found with a security name(s): ${JSON.stringify(pathObject.security)}
    However no security definitions were found in the openapi file.
    `.red.bold);
    return '';
  }

  const securityDefinitions =
    fullSwaggerObject.securityDefinitions ||
    fullSwaggerObject.components.securitySchemes;

  /**
   * Example input "security": [{"apiKeyAdmin": []},{"jwtToken": []}],
   */
  const names: string[] = [];
  pathObject.security.forEach((secObj: any) => {
    Object.keys(secObj).forEach((name) => {
      if (securityDefinitions[name]) {
        const headerName = ['bearer', 'oauth2', 'basic'].includes(
          securityDefinitions[name].scheme || securityDefinitions[name].type
        )
          ? 'Authorization'
          : securityDefinitions[name].name;
        names.push("'" + headerName + "'");
      }
    });
  });
  if (names.length === 0) {
    console.error(`
    WARNING: A path object was found with a security name(s): ${JSON.stringify(pathObject.security)}
    However, no matching security definitions were found in the openapi file: ${JSON.stringify(securityDefinitions)}
    `.red.bold);
  }
  return names.length === 0 ? '' : '[' + names.join(', ') + ']';
};
