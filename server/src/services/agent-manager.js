const ConfigDTO = require('./rest/conf-dto');
const GitDTO = require('./rest/git-dto');
const BuildDTO = require('./rest/build-dto');
const AgentDTO = require('./rest/agent-dto');
const {periodicRetry} = require('../../../agent/src/services/retry');
const AgentQueue = require('./agent-queue');
const Queue = require('./queue');

class AgentManager {
  static async setToQueue(commitHash, branch) {
    const config = await ConfigDTO.getConf();
    const {repoName, mainBranch, buildCommand} = config;
    const promises = [GitDTO.getCommit(repoName, commitHash)];
    if (!branch) {
      promises.push(GitDTO.getCommitBranches(repoName, commitHash));
    }
    const [commit, branches] = await Promise.all(promises);
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
              .then((agent) => Promise.all([
                agent.build(id, commitHash, repoName, buildCommand),
                BuildDTO.setBuildStart(id)
              ]))
              .then(() => next()),
          'Try to build next on agent'
      );
    });
    return build;
  }

  static registerAgentToQueue(url) {
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

  static getId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

AgentManager.buildQueue = new Queue();
AgentManager.agents = new Map();

module.exports = AgentManager;
