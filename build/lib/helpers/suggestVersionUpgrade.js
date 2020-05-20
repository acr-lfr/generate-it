"use strict";
exports.__esModule = true;
exports.suggestVersionUpgrade = void 0;
var semverCompare_1 = require("./semverCompare");
var looksLikeAVersion = function (v) {
    return !/[^0-9a-zA-Z.+-]/.test(v) && /\d/.test(v);
};
exports.suggestVersionUpgrade = function (deps, baseCommand) {
    if (!deps)
        return;
    var commandParts = Object.entries(deps).reduce(function (installCmd, _a) {
        var pkgName = _a[0], diff = _a[1];
        var masterVersion = diff['Changed To'].replace(/^[^0-9a-zA-Z.]/, '');
        var localVersion = diff.from.replace(/^[^0-9a-zA-Z.]/, '');
        if (!looksLikeAVersion(masterVersion)) {
            return installCmd;
        }
        else if (!looksLikeAVersion(localVersion)) {
            return installCmd.concat(pkgName + "@" + masterVersion);
        }
        if (semverCompare_1.semverCompare(masterVersion, localVersion) < 0) {
            return installCmd;
        }
        return installCmd.concat(pkgName + "@" + masterVersion);
    }, [baseCommand]);
    if (commandParts.length > 1) {
        return commandParts.join(' ');
    }
};
exports["default"] = exports.suggestVersionUpgrade;
