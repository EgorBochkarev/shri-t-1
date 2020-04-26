import ServerDTO from '../services/rest/server-dto';
import {tryTillTheEnd} from '../services/retry';
import {exec} from 'child_process';

export type BuildRequest = {
  id:string
  commitHash:string
  repoName:string
  buildCommand:string
}

class Builder {
  static notifyServer = true
  static build({id, commitHash, repoName, buildCommand}:BuildRequest) {
    const startDate = Date.now();
    return new Promise((resolve) => {
      const command = `docker container run --rm node /bin/bash -c "git clone https://github.com/${repoName}.git build && cd build && git reset ${commitHash} --hard && ${buildCommand}"`;
      const child = exec(command);
      console.log(`[${new Date().toISOString()}][STDOUT] Start build`);
      resolve();
      let scriptOutput = '';
      child.stdout && child.stdout.on('data', function(data) {
        data = data.toString();
        process.stdout.write(`[${new Date().toISOString()}][STDOUT] ${data}`);
        scriptOutput += data;
      });
      child.stderr && child.stderr.on('data', function(data) {
        data = data.toString();
        process.stdout.write(`[${new Date().toISOString()}][STDERR] ${data}`);
        scriptOutput += data;
      });
      child.on('close', function(code) {
        if (Builder.notifyServer) {
          tryTillTheEnd(() => ServerDTO.finishedBuild({
            buildId: id,
            duration: Date.now() - startDate,
            success: !code,
            buildLog: scriptOutput,
          }), 'Fail to send build result').then(() => {
            console.log('Result sended');
          });
        }
      });
      child.on('exit', function(code, signal) {
        // eslint-disable-next-line max-len
        console.log(`[${new Date().toISOString()}][STDOUT] Finish with code ${code} and signal ${signal}`);
      });
    });
  }
}

export default Builder;
