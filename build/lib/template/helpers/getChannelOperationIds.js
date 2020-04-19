"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var includeChannelAction_1 = tslib_1.__importDefault(require("../../../utils/includeChannelAction"));
function default_1(action, nodegenRc, channels) {
    var publishOperationIds = [];
    for (var channelName in channels) {
        var channel = channels[channelName];
        if (channel.subscribe) {
            if (includeChannelAction_1["default"](nodegenRc, action, channel)) {
                publishOperationIds.push(channel[action].operationId);
            }
        }
    }
    return publishOperationIds;
}
exports["default"] = default_1;
