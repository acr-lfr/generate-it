import getOpIdsFromAsyncApi from '@/lib/helpers/getOpIdsFromAsyncApi';
import { NodegenRc } from '@/interfaces/NodegenRc';

/**
 * TODO: potential improvement opposed to loops
 * const uniques = [...new Set(input.map(obj => obj.value))];
   if (uniques.length !== input.length) {
    throw 'has dupes';
   }
 */

export default (apiObject: any, nodegenRc: NodegenRc) => {
  if (!apiObject.channels) {
    return true;
  }

  const subIds: string[] = [];
  nodegenRc.helpers?.subscribeOpIds?.forEach((item) => {
    if (!subIds.includes(item)) {
      subIds.push(item);
    } else {
      throw new Error('The nodegenrc file contains duplicate subscribeOpIds');
    }
  });

  const pubIds: string[] = [];
  nodegenRc.helpers?.publishOpIds?.forEach((item) => {
    if (!pubIds.includes(item)) {
      pubIds.push(item);
    } else {
      throw new Error('The nodegenrc file contains duplicate publishOpIds');
    }
  });

  const idsToCompare = getOpIdsFromAsyncApi(apiObject);
  pubIds.concat(subIds).forEach((id) => {
    if (!idsToCompare.includes(id)) {
      throw new Error('The nodegenrc file wants to PUBLISH or SUBSCRIBE to an id that does not exists in the async api file provided: ' + id);
    }
  });
};
