const a = {
  'package': {'name': 'streetlights-api'}, 'swagger': {
    'asyncapi': '2.0.0',
    'info': {'title': 'Streetlights API', 'version': '1.0.0', 'description': 'G2 RabbitMQ routing keys', 'license': {'name': 'Apache 2.0', 'url': 'https://www.apache.org/licenses/LICENSE-2.0'}},
    'defaultContentType': 'application/json',
    'channels': {
      'ms_auth-connection-updated': {
        'description': 'When a connection is updated',
        'parameters': {'updatedId': {'description': 'ID String', 'schema': {'type': 'string'}}},
        'publish': {
          'operationId': 'ms_auth.connection.updated.publish',
          'message': {
            'contentType': 'application/json',
            'payload': {
              'type': 'object',
              'properties': {'username': {'type': 'string'}, 'connections': {'type': 'array', 'items': {'type': 'object', 'properties': {'updated': {'type': 'string', 'format': 'date'}, 'state': {'type': 'string'}, 'username': {'type': 'string'}}}}}
            }
          },
          'x-request-definitions': {'publish': {'name': '', 'params': ['components.parameters.updatedId'], 'interfaceText': {'outputString': 'export interface  {\n  \'undefined\'?:string,  \n } '}}},
          'x-response-definitions': 'ms_auth-cache-connection'
        },
        'subscribe': {
          'operationId': 'ms_auth-connection-updated-subscribe',
          'message': {
            'contentType': 'application/json',
            'payload': {
              'type': 'object',
              'properties': {'username': {'type': 'string'}, 'connections': {'type': 'array', 'items': {'type': 'object', 'properties': {'updated': {'type': 'string', 'format': 'date'}, 'state': {'type': 'string'}, 'username': {'type': 'string'}}}}}
            }
          },
          'x-request-definitions': {'subscribe': {'name': '', 'params': ['components.parameters.updatedId'], 'interfaceText': {'outputString': 'export interface  {\n  \'undefined\'?:string,  \n } '}}},
          'x-response-definitions': 'ms_auth-cache-connection'
        }
      }
    },
    'components': {
      'parameters': {'updatedId': {'description': 'ID String', 'schema': {'type': 'string'}}},
      'schemas': {
        'ms_auth-cache-connection': {
          'type': 'object',
          'properties': {'username': {'type': 'string'}, 'connections': {'type': 'array', 'items': {'type': 'object', 'properties': {'updated': {'type': 'string', 'format': 'date'}, 'state': {'type': 'string'}, 'username': {'type': 'string'}}}}}
        }
      }
    },
    'interfaces': [{
      'name': 'ms_auth-cache-connection',
      'content': {'outputString': 'export interface MsAuthCacheConnection {\n    connections?: Connection[];\n    username?:    string;\n}\n\nexport interface Connection {\n    state?:    string;\n    updated?:  Date;\n    username?: string;\n}\n\n'}
    }],
    'basePath': '',
    'endpoints': []
  }, 'definitions': [], 'endpoints': [], 'additionalTplObject': {}
};
