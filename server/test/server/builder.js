const Builder = require('../../src/builder/builder');
const CommitModel = require('../../src/models/commit-model');
const {it} = require('mocha');
const {expect} = require('chai');

const result = {
  inQueue: undefined,
  requestedBuild: undefined,
  startedBuild: undefined,
  finishedBuild: undefined
};

describe('Builder tests:', () => {
  before((done) => {
    Builder.gitDTO = {
      getCommit: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(new CommitModel(
                'commitHash',
                'commitMessage',
                'authorName'
            ));
          }, 500);
        });
      },
      getCommitBranches: (repo, commitHash) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(['brunchName', 'a', 'b']);
          }, 500);
        });
      }
    };
    Builder.configDTO = {
      getConf: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              id: '123',
              repoName: 'repoName',
              buildCommand: 'buildCommand',
              mainBranch: 'mainBranch',
              period: 10
            });
          }, 500);
        });
      }
    };
    Builder.buildDTO = {
      setBuildRequest: (commit) => {
        result.requestedBuild = commit;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({id: 'buildId'});
          }, 500);
        });
      },
      getBuildDetails: (buildId) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              id: 'buildId',
              configurationId: '123',
              buildNumber: 1,
              commitMessage: 'commitMessage',
              commitHash: 'hash',
              branchName: 'master',
              authorName: 'authorName',
              status: 'Waiting'
            });
          }, 500);
        });
      },
      setBuildStart: (id) => {
        result.startedBuild = id;
      },
      setBuildFinish: (build) => {
        result.finishedBuild = build;
        done();
      }
    };

    // Acting
    Builder.setToQueue('hash').then((build) => {
      result.inQueue = build;
    });
  });
  it('Check response on set to queue', () => {
    expect(result.inQueue).to.include({id: 'buildId',
      configurationId: '123',
      buildNumber: 1,
      commitMessage: 'commitMessage',
      commitHash: 'hash',
      branchName: 'master',
      authorName: 'authorName',
      status: 'Waiting'
    });
  });
  it('Check payload to request build', () => {
    expect(result.requestedBuild).to.include({
      commitHash: 'commitHash',
      commitMessage: 'commitMessage',
      branchName: 'brunchName',
      authorName: 'authorName'
    });
  });
  it('Check notification that build started', () => {
    expect(result.startedBuild).to.equal('buildId');
  });
  it('Check build result', () => {
    expect(result.finishedBuild).to.include.all.keys('duration').to.include({
      buildId: 'buildId',
      success: true,
      buildLog: `Cloning into 'build'...\nremote: Not Found\nfatal: repository 'https://github.com/repoName.git/' not found\n`
    });
  });
});

