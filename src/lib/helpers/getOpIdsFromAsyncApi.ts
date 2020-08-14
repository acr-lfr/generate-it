export default (obj: any): string[] => {
  const ids: string[] = [];
  for (const channelPath in obj.channels) {
    const channel = obj.channels[channelPath];
    if (channel.publish) {
      ids.push(channel.publish.operationId);
    }
    if (channel.subscribe) {
      ids.push(channel.subscribe.operationId);
    }
  }
  return ids;
};
