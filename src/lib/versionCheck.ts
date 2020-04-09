import 'colors';
import { IncomingMessage } from 'http';
import semver from 'semver';
import inquirer from 'inquirer';

const https = require('https');

export default (thisVersion: string) => {
  console.log('Checking generate-it version');
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/acrontum/generate-it/master/package.json', (res: IncomingMessage) => {
      let a = '';
      res.on('data', (d) => {
        a += d.toString();
      });
      res.on('close', () => {
        const remoteVersion = (JSON.parse(a)).version;
        if (semver.lt(thisVersion, remoteVersion)) {
          const error = 'WARNING: The version you are running, ' + thisVersion.bold + ', is' + ' OUTDATED!'.bold;
          console.log(error.red);
          console.log('We are now on a better version: '.red + remoteVersion.green.bold);
          const questions = [{
            type: 'confirm',
            name: 'installConfirm',
            message: 'Are you sure you want to continue with an outdated package? This will result in some serious technical dept in the future and prevent security updates arriving in your API...'.red,
            default: false,
          }];
          inquirer.prompt(questions)
            .then((answers: any) => {
              if (answers.installConfirm) {
                const smiley = '   :-| 😬😬   '.red.bold;
                console.log(smiley + 'Ok.. Continuing with the outdated version...'.red);
                setTimeout(() => console.log(smiley + 'Best of luck...'.red), 1000);
                setTimeout(() => resolve(), 3000);
              } else {
                const smiley = '    (^‿^)    '.green.bold;
                console.log(smiley + 'Great choice! Update generate-it and be happy.'.green);
                return reject();
              }
            })
            .catch((e: any) => {
              console.error(e);
            });
        } else {
          const smiley = '    (ꙨပꙨ)   '.green.bold;
          console.log(' ');
          console.log(smiley + 'Your version of generate-it looks fresh and shiny, nice'.green);
          console.log(' ');
          console.log(' ');
          resolve();
        }
      });
    }).on('error', (e: Error) => {
      console.log('Not internet connection, could not check the version is not outdated:' + e.message);
      console.log('Continuing to build...');
      return resolve();
    });
  });
};
