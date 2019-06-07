const paramsOutputReducer = require('../paramsOutputReducer.js')

it('Example input response of mixed should return valid string', () => {
  const responses = {
    '200': {
      'description': 'Fetched items',
      'schema': {
        'type': 'object',
        'properties': {
          'id': { 'type': 'string', 'description': 'UUID of the item, generated at the server' },
          'birthday': { 'type': 'string', 'format': 'date-time' },
          'birthday2': { 'type': 'string', 'format': 'date' },
          'dateAdded': { 'type': 'string', 'description': 'The date the item was added, added by the server' },
          'addedByUsername': { 'type': 'string', 'description': 'Username string of the user who added the items' },
          'recommendation': { 'type': 'boolean', 'description': 'If the item is a recommendation, true, or not, false' },
          'recommendationForUserName': { 'type': 'string', 'description': 'The username of the recommendee' },
          'channelId': { 'type': 'string', 'description': 'The ID of the channel the item was added to' },
          'channelName': { 'type': 'string', 'description': 'The name of the channel the item was added to' },
          'text': { 'type': 'string', 'description': 'The text of the item, this includes URL and user added personel text' },
          'url': { 'type': 'string', 'description': 'The the URL of the item if found' },
          'urlPreviewHTML': { 'type': 'string', 'description': 'The HTML preview scraped' },
          'urlImage': {
            'type': 'object',
            'properties': {
              'id': { 'type': 'string', 'description': 'UUID of the image' },
              'name': { 'type': 'string', 'description': 'Original name of the image' },
              'sizeKB': { 'type': 'string', 'description': 'Size in KB of the original image' },
              'height': { 'type': 'number', 'description': 'The height in pixels of the image' },
              'width': { 'type': 'number', 'description': 'The width in pixels of the image' }
            }
          },
          'userAddedPhotos': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'id': { 'type': 'string', 'description': 'UUID of the image' },
                'name': { 'type': 'string', 'description': 'Original name of the image' },
                'sizeKB': { 'type': 'string', 'description': 'Size in KB of the original image' },
                'height': { 'type': 'number', 'description': 'The height in pixels of the image' },
                'width': { 'type': 'number', 'description': 'The width in pixels of the image' }
              }
            }
          }
        }
      }
    }
  }
  const returnString = `{id: String, birthday: Object, birthday2: String, dateAdded: String, addedByUsername: String, recommendation: Boolean, recommendationForUserName: String, channelId: String, channelName: String, text: String, url: String, urlPreviewHTML: String, urlImage: {id: String, name: String, sizeKB: String, height: Number, width: Number, },userAddedPhotos: [ { id: String, name: String, sizeKB: String, height: Number, width: Number, }],},`
  expect(paramsOutputReducer(responses)).toBe(returnString)
})

// Todo get the validation of array of array completed.
// it('Validate array of arrays', () => {
//   const responses = {
//     '200': {
//       'description': 'Fetched items',
//       'schema': {
//         'type': 'object',
//         'properties': {
//           'meta': {
//             'type': 'object',
//             'properties': {
//               'count': { 'type': 'number', 'description': 'The width in pixels of the image' }
//             }
//           },
//           'data': {
//             'type': 'object',
//             'properties': {
//               'people': {
//                 'type': 'array',
//                 'items': {
//                   'type': 'array',
//                   'items': {
//                     'type': 'object',
//                     'properties': {
//                       'name': {
//                         'type': 'string'
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
//   const returnString = `{meta: {count: Number, },data: {addedByUsername: String, uniqueItemName: String, createdAt: Object, updatedAt: Object, editable: {channel: {id: String, name: String, },text: String, },url: {address: String, description: String, title: String, },userPhotos: [ { id: String, name: String, sizeKB: String, height: Number, width: Number, }],},},`
//   expect(paramsOutputReducer(responses)).toBe(returnString)
// })
