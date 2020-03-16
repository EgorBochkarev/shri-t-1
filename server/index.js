const Server = require('./server');
const SecurityService = require('./services/oauth2/security-service');
const { execFile } = require('child_process');

execFile('docker', ['ps'], (err, out) => {
    if (err) {
        console.error('Please instal and run docker deamon')
    } else {
        SecurityService.start().then(() => {
            Server.startServer(3000);
        }).catch((error) => {
            console.log('Error:', error);
        })
    }
})
