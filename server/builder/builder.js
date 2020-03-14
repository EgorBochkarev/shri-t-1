const ConfigDTO = require('../services/rest/conf-dto');
const GitDTO = require('../services/rest/git-dto');
const BuildDTO = require('../services/rest/build-dto');
const Queue = require('./queue');

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
            Builder.startBuild(object).then(() => {
                next();
            });
        })
        return build;
    }

    static async startBuild({ id }) {
        const [buildResult] = await Promise.all([
            Builder.build(),
            BuildDTO.setBuildStart(id)
        ]);
        return BuildDTO.setBuildFinish({ buildId: id, ...buildResult});
    }

    static async build(gitRepo, command, commit) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    duration: 10000,
                    success: true,
                    buildLog: "stringDCVSDVSDVDSVDSVDS"
                })
            }, 10000)
        })
    }
}

module.exports = Builder;