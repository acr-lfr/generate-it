/**
 * Extracts the security key names from a path object and returns as a tpl string or array
 * @param pathObject
 * @param fullSwaggerObject
 */
export default (pathObject: any, fullSwaggerObject: any): string => {
  if (!pathObject || !pathObject.security || pathObject.security.length === 0 || !fullSwaggerObject.securityDefinitions) {
    return '';
  }

  /**
   * Example input "security": [{"apiKeyAdmin": []},{"jwtToken": []}],
   */
  const names: string[] = [];
  pathObject.security.forEach((secObj: any) => {
    Object.keys(secObj).forEach((name) => {
      if (fullSwaggerObject.securityDefinitions[name]) {
        const headerName = fullSwaggerObject.securityDefinitions[name].name;
        names.push(`'${headerName}'`);
      }
    });
  });
  return (names.length === 0) ? '' : '[' + names.join(', ') + ']';
};
