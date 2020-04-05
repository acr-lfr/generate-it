"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var semver_1 = tslib_1.__importDefault(require("semver"));
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var https = require('https');
exports["default"] = (function () {
    return new Promise(function (resolve, reject) {
        https.get('https://raw.githubusercontent.com/acrontum/generate-it/master/package.json', function (res) {
            var a = '';
            res.on('data', function (d) {
                a += d.toString();
            });
            res.on('close', function () {
                var remoteVersion = (JSON.parse(a)).version;
                var thisVersion = require('../../package.json').version;
                if (semver_1["default"].lt(thisVersion, remoteVersion)) {
                    var error = 'WARNING: The version you are running, ' + thisVersion.bold + ', is' + ' OUTDATED!'.bold;
                    console.log(error.red);
                    console.log('We are now on a better version: '.red + remoteVersion.green.bold);
                    var questions = [{
                            type: 'confirm',
                            name: 'installConfirm',
                            message: 'Are you sure you want to continue with an outdated package? This will result in some serious technical dept in the future and prevent security updates arriving in your API...'.red,
                            "default": false
                        }];
                    inquirer_1["default"].prompt(questions)
                        .then(function (answers) {
                        if (answers.installConfirm) {
                            var smiley = '    (☉ ϖ ☉)   '.red.bold;
                            console.log(smiley + 'Continuing with the unsafe version... you have chosen... poorly... something bad is likely going to happen to your code.'.red);
                        }
                        else {
                            var smiley = '    (^‿^)    '.green.bold;
                            console.log(smiley + 'You have chosen... wisely. Update and be happy.'.green);
                        }
                    })["catch"](function (e) {
                        console.error(e);
                    });
                }
                else {
                    var smiley = '    (ꙨပꙨ)   '.green.bold;
                    console.log(' ');
                    console.log(smiley + 'Your version of generate-it looks fresh and shiny, nice'.green);
                    console.log(' ');
                    console.log(' ');
                    resolve();
                }
            });
        }).on('error', function (e) {
            console.log('Not internet connection, could not check the version is not outdated:');
            console.error(e.message);
        });
    });
});
