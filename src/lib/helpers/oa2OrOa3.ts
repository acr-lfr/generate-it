export default (param: any) => {
  if (param.type) {
    const assign: any = {};
    assign[param.name] = {
      type: param.type,
    };
    return assign;
  } else {
    return param.schema;
  }
};
