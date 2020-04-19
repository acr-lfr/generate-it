import NodegenRc from '@/interfaces/NodegenRc';

export default (nodegenRc: NodegenRc, action: string, channel: any) => {
  return (
    nodegenRc.asyncApi.stubChannelType.includes(action)
    &&
    (
      (
        nodegenRc.asyncApi.includedOperationIds
        && nodegenRc.asyncApi.includedOperationIds.includes(channel[action].operationId)
      )
      ||
      (
        nodegenRc.asyncApi.excludedOperationIds
        && !nodegenRc.asyncApi.excludedOperationIds.includes(channel[action].operationId)
      )
      ||
      (
        !nodegenRc.asyncApi.includedOperationIds
        && !nodegenRc.asyncApi.includedOperationIds
      )
    )
  );
};
