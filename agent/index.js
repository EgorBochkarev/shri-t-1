const Server = require('./src/server');
const GitDTO = require('../server/src/services/rest/git-dto');
const ServerDTO = require('./src/services/rest/server-dto');
const Builder = require('./src/builder/builder');
const {tryWithRetry} = require('./src/services/retry');
const {execFile} = require('child_process');
require('dotenv').config();
const defaultConfig = require('./agent-conf.json');
const commandLineArgs = require('command-line-args');

const option = commandLineArgs([
  {name: 'port', alias: 'p', type: Number},
  {name: 'server-url', alias: 's', type: String},
  {name: 'alone', alias: 'a', type: Boolean}
]);

const {
  GIT_HUB_LOGIN: gitHubLogin,
  GIT_HUB_PSWD: gitHubPswd,
  PORT: port,
  HOST: host,
  SERVER_URL: serverURL
} = process.env;

const config = Object.assign({}, defaultConfig, process.env.NODE_ENV_PATH ?
  require(process.env.NODE_ENV_PATH) : {});

console.log('Server will run with config:', config);


execFile('docker', ['ps'], (err, out) => {
  if (err) {
    console.error('Please instal and run docker deamon');
  } else {
    if (gitHubLogin && gitHubPswd) {
      GitDTO.baseURL = `https://${gitHubLogin}:${gitHubPswd}@api.github.com/repos`;
    };
    if (option['server-url'] || serverURL) {
      ServerDTO.baseUrl = option['server-url'] || serverURL;
    } else {
      ServerDTO.baseUrl = `http://${config.serverHost}:${config.serverPort}`;
    }
    Server.startServer(option.port || port || config.port);
    Builder.notifyServer = !option.alone;
    if (!option.alone) {
      tryWithRetry(
          () => ServerDTO.notify(
              `${host || config.host}:${option.port || port || config.port}`
          ),
          5,
          'Notify server feil, left {noAtempt} attempts'
      ).then((id) => {
        ServerDTO.agentId = id;
        console.log(`Agent registered (${id}) ready to build`);
      }).catch((e) => {
        console.error(
            // eslint-disable-next-line max-len
            'Can\'t connect to build-server please check server-host and server-port:',
            e.message
        );
        process.exit(1);
      });
    }
  }
});
