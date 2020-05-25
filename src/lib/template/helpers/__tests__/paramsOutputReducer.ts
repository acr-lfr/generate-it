import paramsOutputReducer from '@/lib/template/helpers/paramsOutputReducer';

it('Example input response of mixed should return valid string', () => {
  const responses = {
    200: {
      description: 'Fetched items',
      schema: {
        type: 'object',
        properties: {
          id: {type: 'string', description: 'UUID of the item, rabbitMQ at the server'},
          birthday: {type: 'string', format: 'date-time'},
          birthday2: {type: 'string', format: 'date'},
          dateAdded: {type: 'string', description: 'The date the item was added, added by the server'},
          addedByUsername: {type: 'string', description: 'Username string of the user who added the items'},
          recommendation: {type: 'boolean', description: 'If the item is a recommendation, true, or not, false'},
          recommendationForUserName: {type: 'string', description: 'The username of the recommendee'},
          channelId: {type: 'string', description: 'The ID of the channel the item was added to'},
          channelName: {type: 'string', description: 'The name of the channel the item was added to'},
          text: {type: 'string', description: 'The text of the item, this includes URL and user added personel text'},
          url: {type: 'string', description: 'The the URL of the item if found'},
          urlPreviewHTML: {type: 'string', description: 'The HTML preview scraped'},
          urlImage: {
            type: 'object',
            properties: {
              id: {type: 'string', description: 'UUID of the image'},
              name: {type: 'string', description: 'Original name of the image'},
              sizeKB: {type: 'string', description: 'Size in KB of the original image'},
              height: {type: 'number', description: 'The height in pixels of the image'},
              width: {type: 'number', description: 'The width in pixels of the image'},
            },
          },
          userAddedPhotos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string', description: 'UUID of the image'},
                name: {type: 'string', description: 'Original name of the image'},
                sizeKB: {type: 'string', description: 'Size in KB of the original image'},
                height: {type: 'number', description: 'The height in pixels of the image'},
                width: {type: 'number', description: 'The width in pixels of the image'},
              },
            },
          },
        },
      },
    },
  };
  /* tslint:disable */
  const returnString = `{id: String, birthday: String, birthday2: String, dateAdded: String, addedByUsername: String, recommendation: Boolean, recommendationForUserName: String, channelId: String, channelName: String, text: String, url: String, urlPreviewHTML: String, urlImage: {id: String, name: String, sizeKB: String, height: Number, width: Number, },userAddedPhotos: [ { id: String, name: String, sizeKB: String, height: Number, width: Number, }],},`;
  /* tslint:enable */
  expect(paramsOutputReducer(responses)).toBe(returnString);
});

it('Validate array of arrays', () => {
  const responses = {
    200: {
      description: 'Fetched items',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            age: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  const returnString = `[ { name: String, age: String, }],`;
  expect(paramsOutputReducer(responses)).toBe(returnString);
});

it('Validate array-interface of arrays', () => {
  const responses = {
    200: {
      description: 'Fetched items',
      schema: {
        type: 'array-interface',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            age: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  const returnString = `[ { name: String, age: String, }],`;
  expect(paramsOutputReducer(responses)).toBe(returnString);
});
