const Server = require('./src/server');
const SecurityService = require('./src/services/oauth2/security-service');
const ConfigService = require('./src/services/rest/conf-dto');
const TaskManager = require('./src/services/task-manager');
const {execFile} = require('child_process');

execFile('docker', ['ps'], (err, out) => {
  if (err) {
    console.error('Please instal and run docker deamon');
  } else {
    SecurityService.start().then(() => {
      Server.startServer(3000);
      ConfigService.getConf().then((conf) => {
        if (conf.period) {
          TaskManager.start(conf);
        }
      });
    }).catch((error) => {
      console.log('Error:', error);
    });
  }
});
