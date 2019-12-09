"use strict";
exports.__esModule = true;
exports["default"] = (function (time1, time2) {
    var diff = Math.round((time2 - time1) / 1000);
    console.log("Seconds passed: " + diff);
});
