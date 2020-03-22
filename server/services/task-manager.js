const GitDTO = require('../services/rest/git-dto');
const Builder = require('../builder/builder');

class TaskManager {
    static start(conf) {
        TaskManager.end();
        TaskManager.period = conf.period;
        TaskManager.repoName = conf.repoName;
        //Do we need interval here or recursive timeOut?
        TaskManager.timerId = setInterval(TaskManager.do, TaskManager.period);
    }
    static end(){
        if (TaskManager.timerId) {
            clearInterval(TaskManager.timerId)
        }
    }

    static do(){
        GitDTO.getCommits(TaskManager.repoName, new Date(new Date() - TaskManager.period * 60000).toISOString()).then(commits => {
            const getBranch = ({commitHash}) => async() => {
                const branches = await GitDTO.getCommitBranches(TaskManager.repoName, commitHash);
                return Builder.setToQueue(commitHash, branches[0]);
            }
            return Promise.all(commits.map(getBranch).map(getBranchFn => getBranchFn()));
        });
    }
}

module.exports = TaskManager;