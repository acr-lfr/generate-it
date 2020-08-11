import getOpIdsFromAsyncApi, { GetOpIdsFromAsyncApi } from '@/lib/helpers/getOpIdsFromAsyncApi';
import NodegenRc from '@/interfaces/NodegenRc';

export default (apiObject: any, nodegenRc: NodegenRc) => {
  if (!apiObject.channels) {
    return true;
  }

  const ids: GetOpIdsFromAsyncApi = {
    publish: [],
    subscribe: []
  };
  nodegenRc.helpers?.subscribeOpIds?.forEach((item) => {
    if (!ids.subscribe.includes(item)) {
      ids.subscribe.push(item);
    } else {
      throw new Error('The nodegenrc file contains duplicate subscribeOpIds');
    }
  });
  nodegenRc.helpers?.publishOpIds?.forEach((item) => {
    if (!ids.publish.includes(item)) {
      ids.publish.push(item);
    } else {
      throw new Error('The nodegenrc file contains duplicate publishOpIds');
    }
  });

  const idsToCompare = getOpIdsFromAsyncApi(apiObject);

  ids.publish.forEach((id) => {
    if (!idsToCompare.publish.includes(id)) {
      throw new Error('The nodegenrc file wants to PUBLISH to an id that does not exists in the async api file provided: ' + id);
    }
  });

  ids.subscribe.forEach((id) => {
    if (!idsToCompare.subscribe.includes(id)) {
      throw new Error('The nodegenrc file wants to SUBSCRIBE to an id that does not exists in the async api file provided: ' + id);
    }
  });
};
