export default (value: any, swagger: any) => {
  if (!value || !value.security || value.security.length === 0) {
    return false;
  }

  /**

   "security": [{
    "apiKeyAdmin": []
    },{
     "jwtToken": []
    }],

   */
  const names: string[] = [];
  value.security.forEach((secObj: any) => {
    Object.keys(secObj).forEach((name) => {
      names.push(`'${name}'`);
    });
  });
  return '[' + names.join(', ') + ']';
};
