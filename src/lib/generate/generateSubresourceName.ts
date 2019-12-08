export default (pathName: string, operationName: string) => {

  const subResource = pathName.substring(operationName.length + 1) || '/';

  return subResource.replace(/}/g, '').replace(/{/g, ':');
};
