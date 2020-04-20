const GitDTO = require('../../../server/src/services/rest/git-dto');
const ServerDTO = require('../services/rest/server-dto');
const {tryTillTheEnd} = require('../services/retry');
const {exec} = require('child_process');

class Builder {
  static build(id, commitHash, repoName, buildCommand) {
    return GitDTO.getCommitBranches(repoName, commitHash).then((branches) => {
      const startDate = Date.now();
      return new Promise((resolve) => {
        const command = `docker container run --rm node /bin/bash -c "git clone https://github.com/${repoName}.git --branch ${branches[0]} build && cd build && git reset ${commitHash} --hard && ${buildCommand} && exit 1"`;
        const child = exec(command);
        console.log(`[${new Date().toISOString()}][STDOUT] Start build`);
        resolve();
        let scriptOutput = '';
        child.stdout.on('data', function(data) {
          data = data.toString();
          process.stdout.write(`[${new Date().toISOString()}][STDOUT] ${data}`);
          scriptOutput += data;
        });
        child.stderr.on('data', function(data) {
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
    });
  }
}

Builder.notifyServer = true;

module.exports = Builder;
