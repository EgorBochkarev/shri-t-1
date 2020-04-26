import ConfigDTO from './rest/conf-dto';
import GitDTO from './rest/git-dto';
import BuildDTO from './rest/build-dto';
import AgentDTO from './rest/agent-dto';
const {periodicRetry} = require('../../../agent/src/services/retry');
import AgentQueue from './agent-queue';
import Queue from './queue';
import CommitModel from '../models/commit-model';

class AgentManager {
  static buildQueue = new Queue();
  static agents = new Map<string, AgentDTO>();
  static async setToQueue(commitHash:string, branch?:string) {
    const config = await ConfigDTO.getConf();
    if (!config) {
      throw Error();
    }
    const {repoName, mainBranch, buildCommand} = config;
    const commits = GitDTO.getCommit(repoName, commitHash);
    let branchPromise;
    if (!branch) {
      branchPromise = GitDTO.getCommitBranches(repoName, commitHash);
    }
    const [commit, branches] = await Promise.all([commits, branchPromise]);
    if (branches) {
      // get first bransh where this commit is HEAD
      branch = branches[0];
    }
    commit.setBranchName(branch || mainBranch);
    const {id} = await BuildDTO.setBuildRequest(commit);
    const build = await BuildDTO.getBuildDetails(id);
    AgentManager.buildQueue.setToQueue(build).then(({object, next}) => {
      return periodicRetry(50)(
          () => AgentQueue.getAvailableAgent()
              .then((agentId) => AgentManager.agents.get(agentId))
              .then((agent) => {
                if (!agent){
                  throw Error();
                }
                return Promise.all([
                  agent.build(id, commitHash, repoName, buildCommand),
                  BuildDTO.setBuildStart(id)
                ])
              })
              .then(() => next()),
          'Try to build next on agent'
      );
    });
    return build;
  }

  static registerAgentToQueue(url:string):string {
    for (const [id, agent] of AgentManager.agents.entries()) {
      if (agent.baseURL === url) {
        AgentQueue.setAgentToQueue(id);
        return id;
      }
    }

    // Some id generator;
    const id = AgentManager.getId();
    AgentManager.agents.set(id, new AgentDTO(url));
    AgentQueue.setAgentToQueue(id);
    return id;
  }

  static getId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default AgentManager;
