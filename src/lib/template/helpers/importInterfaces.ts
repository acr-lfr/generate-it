import isValidMethod from './isValidMethod';
import { Operation } from '@/interfaces/Operations';

/**
 *
 * @param operations - Array of operations from generate/GenerateOperation.ts
 * @param [actions] - An optional array of actions to include, eg "get" or "post or "subscribe" or "publish" or any other channel/http method
 */
export default function (operations: any, actions?: string[]) {
  try {
    const imports: any[] = [];
    operations.forEach((operation: Operation) => {
      const operationType = operation.path ? 'path' : 'channel';
      Object.keys(operation[operationType]).forEach((pathKey) => {
        const path = operation[operationType][pathKey];
        if (operationType === 'channel') {
          if (
            !actions ||
            (actions && actions.length === 0) ||
            (actions && actions.length > 0 && actions.includes(pathKey))
          ) {
            if (typeof path['x-request-definitions'] === 'string') {
              imports.push(path['x-request-definitions']);
            }
            if (typeof path['x-response-definitions'] === 'string') {
              imports.push(path['x-response-definitions']);
            }
          }
        } else {
          if (isValidMethod(pathKey)) {
            // Inject the request parameter interfaces
            ['query', 'path', 'body', 'header', 'formData'].forEach((requestType) => {
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
        }
      });
    });

    imports.sort();
    return new Set(imports).keys();
  } catch (e) {
    console.log(e);
    throw e;
  }
}
