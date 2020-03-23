const GitDTO = require('../services/rest/git-dto');
const Builder = require('../builder/builder');

class TaskManager {
  static start(conf) {
    TaskManager.end();
    TaskManager.period = conf.period * 60000;
    TaskManager.repoName = conf.repoName;
    // Do we need interval here or recursive timeOut?
    TaskManager.do();
    TaskManager.timerId = setInterval(TaskManager.do, TaskManager.period);
  }
  static end() {
    if (TaskManager.timerId) {
      clearInterval(TaskManager.timerId);
    }
  }

  static do() {
    console.log('Start periodical task');
    // eslint-disable-next-line max-len
    GitDTO.getCommits(TaskManager.repoName, new Date(new Date() - TaskManager.period).toISOString()).then((commits) => {
      const getBranch = ({commitHash}) => async () => {
        // eslint-disable-next-line max-len
        const branches = await GitDTO.getCommitBranches(TaskManager.repoName, commitHash);
        console.log(`Set commit (${commitHash} from ${branches[0]}) to queue`);
        return Builder.setToQueue(commitHash, branches[0]);
      };
      // eslint-disable-next-line max-len
      return Promise.all(commits.map(getBranch).map((getBranchFn) => getBranchFn()));
    });
  }
}

module.exports = TaskManager;
