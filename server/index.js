const Server = require('./server');
const SecurityService = require('./services/oauth2/security-service');
const ConfigService = require('./services/rest/conf-dto');
const TaskManager = require('./services/task-manager');
const { execFile } = require('child_process');

execFile('docker', ['ps'], (err, out) => {
    if (err) {
        console.error('Please instal and run docker deamon')
    } else {
        SecurityService.start().then(() => {
            Server.startServer(3000);
            ConfigService.getConf().then(conf => {
                if (conf.period) {
                    TaskManager.start(conf);
                }
            })
        }).catch((error) => {
            console.log('Error:', error);
        })
    }
})
