const a = {
  channel_name: 'msAuthConnectionDeleted',
  channel: {
    description: 'When a connection is deleted',
    parameters: {
      updatedId: { description: 'ID String', schema: { type: 'string' } },
    },
    publish: {
      'operationId': 'msAuthConnectionDeletedPublish',
      'message': {
        contentType: 'application/json',
        payload: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            connections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  updated: { type: 'string', format: 'date' },
                  state: { type: 'string' },
                  username: { type: 'string' },
                },
              },
            },
          },
        },
      },
      'x-request-definitions': {
        publish: {
          name: '',
          params: ['components.parameters.updatedId'],
          interfaceText: {
            outputString: "export interface  {\n  'undefined'?:string,  \n } ",
          },
        },
      },
      'x-response-definitions': 'ms_auth-cache-connection',
    },
    subscribe: {
      'operationId': 'msAuthConnectionDeletedSubscribe',
      'message': {
        contentType: 'application/json',
        payload: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            connections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  updated: { type: 'string', format: 'date' },
                  state: { type: 'string' },
                  username: { type: 'string' },
                },
              },
            },
          },
        },
      },
      'x-request-definitions': {
        subscribe: {
          name: '',
          params: ['components.parameters.updatedId'],
          interfaceText: {
            outputString: "export interface  {\n  'undefined'?:string,  \n } ",
          },
        },
      },
      'x-response-definitions': 'ms_auth-cache-connection',
    },
  },
};
