import includeChannelAction from '@/utils/includeChannelAction';
import NodegenRc from '@/interfaces/NodegenRc';

export default function (action: string, nodegenRc: NodegenRc, channels: any): string[] {
  const publishOperationIds = [];
  for (const channelName in channels) {
    const channel = channels[channelName];
    if (channel.subscribe) {
      if (includeChannelAction(nodegenRc, action, channel)) {
        publishOperationIds.push(channel[action].operationId);
      }
    }
  }
  return publishOperationIds;
}
