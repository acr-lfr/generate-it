import isValidMethod from './isValidMethod';

export default function (operations: any) {
  const imports: any[] = [];
  Object.keys(operations).forEach((operationKey) => {
    const operation = operations[operationKey];
    Object.keys(operation.path).forEach((pathKey) => {
      const path = operation.path[pathKey];
      if (isValidMethod(pathKey)) {
        // Inject the request parameter interfaces
        ['query', 'path', 'body', 'headers', 'formData'].forEach((requestType) => {
          if (path['x-request-definitions'][requestType]) {
            if (path['x-request-definitions'][requestType].interfaceName) {
              if (imports.indexOf(path['x-request-definitions'][requestType].interfaceName) === -1) {
                imports.push(path['x-request-definitions'][requestType].interfaceName);
              }
            }
            if (requestType === 'body') {
              imports.push(path['x-request-definitions'][requestType].params[0].name);
            } else {
              if (path['x-request-definitions'][requestType].name) {
                if (imports.indexOf(path['x-request-definitions'][requestType].name) === -1) {
                  imports.push(path['x-request-definitions'][requestType].name);
                }
              }
            }
          }
        });
        // Inject the response interfaces
        if (path['x-response-definitions']) {
          for (const statusCode in path['x-response-definitions']) {
            if (imports.indexOf(path['x-response-definitions'][statusCode]) === -1) {
              imports.push(path['x-response-definitions'][statusCode]);
            }
          }
        }
      }
    });
  });
  imports.sort();
  return imports;
}
