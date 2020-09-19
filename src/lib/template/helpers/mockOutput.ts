import extractOASchemaPathResponses from '@/lib/helpers/extractOASchemaPathResponses';

const dummyGenerate = (schema: any) => {
  return schema ? 'return mockItGenerator(' + JSON.stringify(schema) + ')' : undefined;
};

export default (path: any, mockServer: boolean) => {
  if (mockServer) {
    return (path && path.responses) ?
      dummyGenerate(extractOASchemaPathResponses(path.responses)) :
      undefined;
  } else {
    return 'return {}';
  }
};
