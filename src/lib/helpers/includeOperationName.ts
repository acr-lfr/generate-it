import NodegenRc from '@/interfaces/NodegenRc';

export default (operationName: string, nodegenRc: NodegenRc): boolean => {
  if (
    !nodegenRc.helpers || !nodegenRc.helpers.operationNames
  ) {
    return true;
  }
  if (
    nodegenRc.helpers.operationNames.include &&
    nodegenRc.helpers.operationNames.include.includes(operationName)
  ) {
    return true;
  }
  if (
    nodegenRc.helpers.operationNames.include &&
    !nodegenRc.helpers.operationNames.include.includes(operationName)
  ) {
    return false;
  }
  if (
    nodegenRc.helpers.operationNames.exclude &&
    !nodegenRc.helpers.operationNames.exclude.includes(operationName)
  ) {
    return true;
  }
  if (
    nodegenRc.helpers.operationNames.exclude &&
    nodegenRc.helpers.operationNames.exclude.includes(operationName)
  ) {
    return false;
  }

  return false;
};
