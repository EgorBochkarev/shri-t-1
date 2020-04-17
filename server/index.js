const Server = require('./src/server');
const SecurityService = require('./src/services/oauth2/security-service');
const ConfigService = require('./src/services/rest/conf-dto');
const BuildDTO = require('./src/services/rest/build-dto');
const TaskManager = require('./src/services/task-manager');
const {execFile} = require('child_process');
require('dotenv').config();
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  {name: 'shri', alias: 's', type: String}
]);

execFile('docker', ['ps'], (err, out) => {
  if (err) {
    console.error('Please instal and run docker deamon');
  } else {
    SecurityService.start().then(() => {
      if (options.shri) {
        BuildDTO.baseUrl = `${options.shri}/build`;
        ConfigService.baseUrl = `${options.shri}/config`;
      }
      Server.startServer(3000);
      ConfigService.getConf().then((conf) => {
        if (conf.period) {
          TaskManager.start(conf);
        }
      }).catch((error) => {
        console.log('Error to start periodical task');
      });
    }).catch((error) => {
      console.log('Error:', error);
    });
  }
});
