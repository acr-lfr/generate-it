"use strict";
exports.__esModule = true;
exports["default"] = (function (nodegenRc, action, channel) {
    return (nodegenRc.asyncApi.stubChannelType.includes(action)
        &&
            ((nodegenRc.asyncApi.includedOperationIds
                && nodegenRc.asyncApi.includedOperationIds.includes(channel[action].operationId))
                ||
                    (nodegenRc.asyncApi.excludedOperationIds
                        && !nodegenRc.asyncApi.excludedOperationIds.includes(channel[action].operationId))
                ||
                    (!nodegenRc.asyncApi.includedOperationIds
                        && !nodegenRc.asyncApi.includedOperationIds)));
});
