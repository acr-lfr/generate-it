import { NodegenRc } from '@/interfaces/NodegenRc';

export default (operationName: string, pathProperties: any, nodegenRc: NodegenRc): boolean | object => {
  if (
    !nodegenRc.helpers || !nodegenRc.helpers.operationNames
  ) {
    return pathProperties;
  }
  if (
    nodegenRc.helpers.operationNames.includePublish &&
    nodegenRc.helpers.operationNames.includePublish.includes(operationName) &&
    pathProperties.publish
  ) {
    if (pathProperties.subscribe) {
      delete pathProperties.subscribe;
    }
    return pathProperties;
  }
  if (
    nodegenRc.helpers.operationNames.includeSubscribe &&
    nodegenRc.helpers.operationNames.includeSubscribe.includes(operationName) &&
    pathProperties.subscribe
  ) {
    if (pathProperties.publish) {
      delete pathProperties.publish;
    }
    return pathProperties;
  }

  return false;
};
