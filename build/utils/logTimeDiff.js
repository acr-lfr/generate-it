"use strict";
exports.__esModule = true;
require("colors");
exports["default"] = (function (time1, time2, green) {
    var diff = Math.round((time2 - time1) / 1000);
    var str = "Seconds passed: " + diff;
    if (green) {
        // @ts-ignore
        console.log(str.green);
    }
    else {
        console.log(str);
    }
});
