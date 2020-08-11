export interface GetOpIdsFromAsyncApi {
  publish: string[];
  subscribe: string[];
}

export default (obj: any): GetOpIdsFromAsyncApi => {
  const ids: GetOpIdsFromAsyncApi = {
    publish: [],
    subscribe: []
  };
  for (const channelPath in obj.channels) {
    const channel = obj.channels[channelPath];
    if (channel.publish) {
      ids.publish.push(channel.publish.operationId);
    }
    if (channel.subscribe) {
      ids.subscribe.push(channel.subscribe.operationId);
    }
  }
  return ids;
};
