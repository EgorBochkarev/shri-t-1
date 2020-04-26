import Server from './src/server';
import SecurityService from './src/services/oauth2/security-service';
import ConfigService from './src/services/rest/conf-dto';
import BuildDTO from './src/services/rest/build-dto';
import GitDTO from './src/services/rest/git-dto';
import TaskManager from './src/services/task-manager';
import {execFile} from 'child_process';
import {config as readEnv} from 'dotenv';
import commandLineArgs from 'command-line-args';

readEnv();

const options = commandLineArgs([
  {name: 'shri', alias: 's', type: String}
]);

execFile('docker', ['ps'], (err, out) => {
  if (err) {
    console.error('Please instal and run docker deamon');
  } else {
    if (process.env.GIT_HUB_LOGIN && process.env.GIT_HUB_PSWD) {
      GitDTO.baseURL = `https://${process.env.GIT_HUB_LOGIN}:${process.env.GIT_HUB_PSWD}@api.github.com/repos`;
    };
    SecurityService.start().then(() => {
      if (options.shri) {
        BuildDTO.baseUrl = `${options.shri}/build`;
        ConfigService.baseUrl = `${options.shri}/config`;
      }
      Server.startServer(3000);
      ConfigService.getConf().then((conf) => {
        if (conf) {
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
