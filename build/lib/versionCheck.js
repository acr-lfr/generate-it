"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("colors");
var semver_1 = tslib_1.__importDefault(require("semver"));
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var https = require('https');
exports["default"] = (function (thisVersion) {
    console.log('Checking generate-it version');
    return new Promise(function (resolve, reject) {
        https.get('https://raw.githubusercontent.com/acrontum/generate-it/master/package.json', function (res) {
            var a = '';
            res.on('data', function (d) {
                a += d.toString();
            });
            res.on('close', function () {
                var remoteVersion = (JSON.parse(a)).version;
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
                            var smiley_1 = '   :-| 😬😬   '.red.bold;
                            console.log(smiley_1 + 'Ok.. Continuing with the outdated version...'.red);
                            setTimeout(function () { return console.log(smiley_1 + 'Best of luck...'.red); }, 1000);
                            setTimeout(function () { return resolve(); }, 3000);
                        }
                        else {
                            var smiley = '    (^‿^)    '.green.bold;
                            console.log(smiley + 'Great choice! Update generate-it and be happy.'.green);
                            return reject();
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
            console.log('Not internet connection, could not check the version is not outdated:' + e.message);
            console.log('Continuing to build...');
            return resolve();
        });
    });
});
