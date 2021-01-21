import extractOASchemaPathResponses from '@/lib/helpers/extractOASchemaPathResponses';

const dummyGenerate = (schema: any, path: any) => {
  if (schema) {
    if (path['x-passResponse']) {
      return `res.end(JSON.stringify(mockItGenerator(${JSON.stringify(schema)}))); return Promise.resolve(null);`;
    } else {
      return `return mockItGenerator(${JSON.stringify(schema)})`;
    }
  }
};

export default (path: any, mockServer: boolean) => {
  if (mockServer) {
    return (path && path.responses) ?
      dummyGenerate(extractOASchemaPathResponses(path.responses), path) :
      undefined;
  } else {
    return 'return {}';
  }
};
