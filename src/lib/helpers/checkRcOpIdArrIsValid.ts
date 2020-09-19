import getOpIdsFromAsyncApi from '@/lib/helpers/getOpIdsFromAsyncApi';
import NodegenRc from '@/interfaces/NodegenRc';

export default (apiObject: any, nodegenRc: NodegenRc) => {
  if (!apiObject.channels) {
    return true;
  }

  const ids: string[] = [];
  nodegenRc.helpers?.subscribeOpIds?.forEach((item) => {
    if (!ids.includes(item)) {
      ids.push(item);
    } else {
      throw new Error('The nodegenrc file contains duplicate subscribeOpIds');
    }
  });
  nodegenRc.helpers?.publishOpIds?.forEach((item) => {
    if (!ids.includes(item)) {
      ids.push(item);
    } else {
      throw new Error('The nodegenrc file contains duplicate publishOpIds');
    }
  });

  const idsToCompare = getOpIdsFromAsyncApi(apiObject);
  ids.forEach((id) => {
    if (!idsToCompare.includes(id)) {
      throw new Error(
        'The nodegenrc file wants to PUBLISH or SUBSCRIBE to an id that does not exists in the async api file provided: ' +
          id
      );
    }
  });
};
