"use strict";
exports.__esModule = true;
exports["default"] = (function (obj) {
    var ids = {
        publish: [],
        subscribe: []
    };
    for (var channelPath in obj.channels) {
        var channel = obj.channels[channelPath];
        if (channel.publish) {
            ids.publish.push(channel.publish.operationId);
        }
        if (channel.subscribe) {
            ids.subscribe.push(channel.subscribe.operationId);
        }
    }
    return ids;
});
