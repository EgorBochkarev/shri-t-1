import GitDTO from '../services/rest/git-dto';
import AgentManager from './agent-manager';
import {Configuration} from '../services/rest/conf-dto';
import CommitModel from '../models/commit-model';

class TaskManager {
  static gitDTO = GitDTO
  static agentManager = AgentManager;
  static period: number;
  static repoName: any;
  static timerId: NodeJS.Timeout;
  
  static start({period, repoName}:Configuration):void {
    this.end();
    this.period = period * 60000;
    this.repoName = repoName;
    // Do we need interval here or recursive timeOut?
    this.do();
    this.timerId = setInterval(this.do, this.period);
  }
  static end():void {
    if (TaskManager.timerId) {
      clearInterval(TaskManager.timerId);
    }
  }

  static do():void {
    console.log('Start periodical task');
    TaskManager.gitDTO.getCommits(
        TaskManager.repoName,
        new Date(Date.now() - TaskManager.period).toISOString()
    ).then((commits) => {
      const getBranch = ({commitHash}:CommitModel) => async () => {
        const branches = await TaskManager.gitDTO.getCommitBranches(
            TaskManager.repoName, commitHash
        );
        console.log(`Set commit (${commitHash} from ${branches[0]}) to queue`);
        return TaskManager.agentManager.setToQueue(commitHash, branches[0]);
      };
      return Promise.all(
          commits.map(getBranch).map((getBranchFn) => getBranchFn())
      );
    }).catch(() => {
      console.error('Can\'t start periodical task');
    });
  }
}

export default TaskManager;
