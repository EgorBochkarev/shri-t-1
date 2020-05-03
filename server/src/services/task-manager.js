const GitDTO = require('../services/rest/git-dto');
const AgentManager = require('./agent-manager');

class TaskManager {
  static start({period, repoName}) {
    TaskManager.end();
    TaskManager.period = period * 60000;
    TaskManager.repoName = repoName;
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
    TaskManager.gitDTO.getCommits(
        TaskManager.repoName,
        new Date(new Date() - TaskManager.period).toISOString()
    ).then((commits) => {
      const getBranch = ({commitHash}) => async () => {
        const branches = await TaskManager.gitDTO.getCommitBranches(
            TaskManager.repoName, commitHash
        );
        console.log(`Set commit (${commitHash} from ${branches[0]}) to queue`);
        return TaskManager.agentManager.setToQueue(commitHash, branches[0]);
      };
      return Promise.all(
          commits.map(getBranch).map((getBranchFn) => getBranchFn())
      );
    }).catch((e) => {
      console.error('Can\'t start periodical task');
    });
  }
}

TaskManager.gitDTO = GitDTO;
TaskManager.agentManager = AgentManager;

module.exports = TaskManager;
