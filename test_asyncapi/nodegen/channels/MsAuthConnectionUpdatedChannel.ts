const a = {
  channel_name: 'msAuthConnectionUpdated',
  channel: {
    description: 'When a connection is updated',
    parameters: {
      updatedId: { description: 'ID String', schema: { type: 'string' } },
    },
    publish: {
      'operationId': 'msAuthConnectionUpdatedPublish',
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
      'operationId': 'msAuthConnectionUpdatedSubscribe',
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
