const Server = require('./server');
const SecurityService = require('./services/oauth2/security-service');

SecurityService.start().then(() => {
    Server.startServer(3000);
}).catch((error) => {
    console.log('Error:', error);
})
