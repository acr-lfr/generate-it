const jsonSchemaResolveAllof = require('json-schema-resolve-allof')

const input = {
  'allOf': [
    {
      'type': 'object',
      'required': [
        'coord'
      ],
      'properties': {
        'coord': {
          'type': 'object',
          'properties': {
            'lon': {
              'type': 'number'
            },
            'lat': {
              'type': 'number'
            }
          }
        }
      }
    },
    {
      'type': 'object',
      'properties': {
        'id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        }
      }
    }
  ]
}

const input2 = {
  'type': 'object',
  'required': [
    'coord'
  ],
  'properties': {
    'coord': {
      'type': 'object',
      'properties': {
        'lon': {
          'type': 'number'
        },
        'lat': {
          'type': 'number'
        }
      }
    }
  }
}

console.log(jsonSchemaResolveAllof(input2))
