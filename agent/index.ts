import Server from './src/server';
import ServerDTO from './src/services/rest/server-dto';
import Builder from './src/builder/builder';
import {tryWithRetry} from './src/services/retry';
import {execFile} from 'child_process';
import {config as readEnv} from 'dotenv';
import defaultConfig from './agent-conf.json';
import commandLineArgs from 'command-line-args';

readEnv();

const option = commandLineArgs([
  {name: 'port', alias: 'p', type: Number},
  {name: 'server-url', alias: 's', type: String},
  {name: 'alone', alias: 'a', type: Boolean}
]);

const {
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
