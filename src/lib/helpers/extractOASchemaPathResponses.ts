export default (input: any) => {
  if (input['200']) {
    if (input['200'].schema) {
      // we are oa2
      return input['200'].schema;
    } else {
      // we are oa3
      if (input['200'].content && input['200'].content['application/json']) {
        if (input['200'].content['application/json'].schema) {
          return input['200'].content['application/json'].schema;
        }
      }
    }
  }
  return (input && input.schema) ? input.schema : {};
};
