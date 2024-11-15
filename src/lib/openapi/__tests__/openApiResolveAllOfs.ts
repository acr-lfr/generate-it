import * as YAML from 'js-yaml';
import fs from 'fs-extra';
import openApiResolveAllOfs from '@/lib/openapi/openApiResolveAllOfs';
import path from 'path';
import * as process from 'node:process';
import $RefParser from '@apidevtools/json-schema-ref-parser';

it('Complex example input: should return all the required fields and the rest should also be properly - deeply nested allOf.', async () => {
  const contentPath = path.join(process.cwd(), 'src/lib/openapi/__tests__/openApiResolveAllOfs_complex_input.yml');
  const content = fs.readFileSync(contentPath).toString();
  const contentAsJson = YAML.safeLoad(content);
  const dereferencedJsonContent = await $RefParser.dereference(contentAsJson, {dereference: {circular: 'ignore'}});
  const resolved = openApiResolveAllOfs(dereferencedJsonContent);

  expect(resolved).toEqual({
      'components': {
        'schemas': {
          'SeriesOwnerEvent': {
            'type': 'object',
            'required': [
              '_id',
              'name',
              'location',
              'contests',
              'dateFromTo'
            ],
            'properties': {
              '_id': {
                'type': 'string'
              },
              'createdAt': {
                'type': 'string',
                'format': 'date-time'
              },
              'updatedAt': {
                'type': 'string',
                'format': 'date-time'
              },
              'name': {
                'type': 'string'
              },
              'description': {
                'type': 'string'
              },
              'contests': {
                'type': 'array',
                'items': {
                  'required': [
                    'name',
                    'description',
                    '_id',
                    'secrets'
                  ],
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'description': {
                      'type': 'string'
                    },
                    '_id': {
                      'type': 'string'
                    },
                    'secrets': {
                      'type': 'array',
                      'items': {
                        'type': 'string'
                      }
                    }
                  }
                }
              }
            }
          },
          'SeriesOwnerEventContests': {
            'type': 'array',
            'items': {
              'required': [
                'name',
                'description',
                '_id',
                'secrets'
              ],
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string'
                },
                'description': {
                  'type': 'string'
                },
                '_id': {
                  'type': 'string'
                },
                'secrets': {
                  'type': 'array',
                  'items': {
                    'type': 'string'
                  }
                }
              }
            }
          },
          'SeriesOwnerEventContest': {
            'required': [
              'name',
              'description',
              '_id',
              'secrets'
            ],
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'description': {
                'type': 'string'
              },
              '_id': {
                'type': 'string'
              },
              'secrets': {
                'type': 'array',
                'items': {
                  'type': 'string'
                }
              }
            }
          },
          'SeriesOwnerEventContestBaseAttributes': {
            'required': [
              'name',
              'description'
            ],
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'description': {
                'type': 'string'
              }
            }
          },
          'EventContestBaseAttributes': {
            'type': 'object',
            'required': [
              'name',
              'description'
            ],
            'properties': {
              'name': {
                'type': 'string'
              },
              'description': {
                'type': 'string'
              }
            }
          }
        }
      }
    }
  );
});

it('Simple example input: should return all the required fields and the rest should also be properly - shallow nesting of allOf.', async () => {
  const contentPath = path.join(process.cwd(), 'src/lib/openapi/__tests__/openApiResolveAllOfs_simple_input.yml');
  const content = fs.readFileSync(contentPath).toString();
  const contentAsJson = YAML.safeLoad(content);
  const dereferencedJsonContent = await $RefParser.dereference(contentAsJson, {dereference: {circular: 'ignore'}});
  const resolved = openApiResolveAllOfs(dereferencedJsonContent);

  expect(resolved).toEqual({
      'components': {
        'schemas': {
          'SeriesOwnerEvent': {
            'type': 'object',
            'required': [
              '_id',
              'name',
              'location',
              'contests',
              'dateFromTo'
            ],
            'properties': {
              '_id': {
                'type': 'string'
              },
              'createdAt': {
                'type': 'string',
                'format': 'date-time'
              },
              'updatedAt': {
                'type': 'string',
                'format': 'date-time'
              },
              'name': {
                'type': 'string'
              },
              'description': {
                'type': 'string'
              },
              'contests': {
                'type': 'array',
                'items': {
                  'required': [
                    '_id'
                  ],
                  'type': 'object',
                  'properties': {
                    '_id': {
                      'type': 'string'
                    },
                    'secrets': {
                      'type': 'array',
                      'items': {
                        'type': 'string'
                      }
                    }
                  }
                }
              }
            }
          },
          'SeriesOwnerEventContests': {
            'type': 'array',
            'items': {
              'required': [
                '_id'
              ],
              'type': 'object',
              'properties': {
                '_id': {
                  'type': 'string'
                },
                'secrets': {
                  'type': 'array',
                  'items': {
                    'type': 'string'
                  }
                }
              }
            }
          },
        }
      }
    }
  );
});
