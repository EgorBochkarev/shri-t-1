const TaskManager = require('../../src/services/task-manager');
const CommitModel = require('../../src/models/commit-model');
const {expect} = require('chai');

it('Check periodical task', (done) => {
  // Prepare
  const buildsInQueue = [];
  TaskManager.gitDTO = {
    getCommits: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            new CommitModel(
                'commitHash',
                'commitMessage',
                'authorName'
            )
          ]);
        }, 500);
      });
    },
    getCommitBranches: (repo, commitHash) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([commitHash, 'a', 'b']);
        }, 500);
      });
    }
  };
  TaskManager.builder = {
    setToQueue: (commitHash, branch) => {
      buildsInQueue.push(`${commitHash}, ${branch}`);
      try {
        if (buildsInQueue.length === 3) {
          expect(buildsInQueue).to.be.an('array').that.includes.members([
            'commitHash, commitHash',
            'commitHash, commitHash',
            'commitHash, commitHash'
          ]);
          TaskManager.end();
          done();
        }
      } catch (e) {
        TaskManager.end();
        done(e);
      }
    }
  };


  // Action
  TaskManager.start({
    period: 0.005,
    repoName: 'Test/test'
  });
});
