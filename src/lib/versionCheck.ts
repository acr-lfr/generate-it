import 'colors';
import { IncomingMessage } from 'http';
import semver from 'semver';
import inquirer from 'inquirer';

const https = require('https');

export default () => {
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/acrontum/generate-it/master/package.json', (res: IncomingMessage) => {
      let a = '';
      res.on('data', (d) => {
        a += d.toString();
      });
      res.on('close', () => {
        const remoteVersion = (JSON.parse(a)).version;
        const thisVersion = require('../../package.json').version;
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
                const smiley = '    (☉ ϖ ☉)   '.red.bold;
                console.log(smiley + 'Continuing with the unsafe version... you have chosen... poorly... something bad is likely going to happen to your code.'.red);
              } else {
                const smiley = '    (^‿^)    '.green.bold;
                console.log(smiley + 'You have chosen... wisely. Update and be happy.'.green);
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
      console.log('Not internet connection, could not check the version is not outdated:');
      console.error(e.message);
    });
  });
};
