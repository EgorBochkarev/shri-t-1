const ConfigDTO = require('../services/rest/conf-dto');
const GitDTO = require('../services/rest/git-dto');
const BuildDTO = require('../services/rest/build-dto');
const Queue = require('./queue');
const { exec } = require('child_process');
 
class Builder {
    static async setToQueue(commitHash) {
        const config = await ConfigDTO.getConf();
        const commit = await GitDTO.getCommit(config.repoName, commitHash);
        commit.setBranchName(config.mainBranch);
        await BuildDTO.setBuildRequest(commit);
        //Here we can not to find right build, it will be bag
        const build = await BuildDTO.getBuildList(0, 20).then(({ data }) => {
            return data.find((build) => build.commitHash === commitHash);
        })
        Queue.setToQueue(build).then(({object, next}) => {
            Builder.startBuild(object, config).then(() => {
                next();
            });
        })
        return build;
    }

    static async startBuild(build, config) {
        const [buildResult] = await Promise.all([
            Builder.build(build, config),
            BuildDTO.setBuildStart(build.id)
        ]);
        return BuildDTO.setBuildFinish(buildResult);
    }

    static build({ id, commitHash }, {repoName, mainBranch, buildCommand}) {
        const startDate = new Date();
        return new Promise((resolve) => {
            const command = `docker container run --rm node /bin/bash -c "git clone https://github.com/${repoName}.git --branch ${mainBranch} build && cd build && git reset ${commitHash} --hard && ${buildCommand}"`
            const child = exec(command);
            var scriptOutput = "";
            child.stdout.setEncoding('utf8');
            child.stdout.on('data', function(data) {
                data=data.toString();
                scriptOutput+=data;
            });
            child.stderr.setEncoding('utf8');
            child.stderr.on('data', function(data) {
                data=data.toString();
                scriptOutput+=data;
            });
            child.on('close', function(code) {
                resolve({
                    buildId: id,
                    duration: new Date() - startDate,
                    success: true,
                    buildLog: scriptOutput
                })
            });
            child.on('exit', function (code, signal) {
                console.log(`child process exited with code ${code} and signal ${signal}`);
            })
        })
    }
}

module.exports = Builder;