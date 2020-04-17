const Builder = require('../../src/builder/builder');
const CommitModel = require('../../src/models/commit-model');
const GitDTO = require('../../src/services/rest/git-dto');
const ConfigDTO = require('../../src/services/rest/conf-dto');
const BuildDTO = require('../../src/services/rest/build-dto');
const {expect} = require('chai');
const sinon = require('sinon');

describe('Builder tests:', () => {
  beforeEach(() => {
    sinon.replace(GitDTO, 'getCommit', sinon.stub().resolves(
        new CommitModel('commitHash', 'commitMessage', 'authorName')
    ));
    sinon.replace(GitDTO, 'getCommitBranches', sinon.stub().resolves(
        ['brunchName', 'a', 'b']
    ));
    sinon.replace(ConfigDTO, 'getConf', sinon.stub().resolves(
        {
          id: '123',
          repoName: 'repoName',
          buildCommand: 'buildCommand',
          mainBranch: 'mainBranch',
          period: 10
        }
    ));
    sinon.replace(BuildDTO, 'setBuildRequest', sinon.fake.returns(
        {id: 'buildId'}
    ));
    sinon.replace(BuildDTO, 'getBuildDetails', sinon.stub().resolves(
        {
          id: 'buildId',
          configurationId: '123',
          buildNumber: 1,
          commitMessage: 'commitMessage',
          commitHash: 'hash',
          branchName: 'master',
          authorName: 'authorName',
          status: 'Waiting'
        }
    ));
    sinon.replace(BuildDTO, 'setBuildStart', sinon.fake());
    sinon.replace(BuildDTO, 'setBuildFinish', sinon.fake());
  });

  afterEach(() => sinon.restore());
  it('Check response on set to queue', (done) => {
    Builder.setToQueue('hash').then((build) => {
      expect(build).to.include({id: 'buildId',
        configurationId: '123',
        buildNumber: 1,
        commitMessage: 'commitMessage',
        commitHash: 'hash',
        branchName: 'master',
        authorName: 'authorName',
        status: 'Waiting'
      });
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check payload to request build', (done) => {
    Builder.setToQueue('hash').then(() => {
      expect(BuildDTO.setBuildRequest.firstArg).to.include({
        commitHash: 'commitHash',
        commitMessage: 'commitMessage',
        branchName: 'brunchName',
        authorName: 'authorName'
      });
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check notification that build started', (done) => {
    Builder.setToQueue('hash').then(() => {
      const interval = setInterval(() => {
        if (BuildDTO.setBuildStart.firstArg) {
          expect(BuildDTO.setBuildStart.firstArg).to.equal('buildId');
          done();
          clearInterval(interval);
        }
      }, 300);
    }).catch((e) => {
      done(e);
    });
  });
  it('Check build result', (done) => {
    Builder.setToQueue('hash').then(() => {
      const interval = setInterval(() => {
        if (BuildDTO.setBuildStart.firstArg) {
          expect(BuildDTO.setBuildFinish.firstArg)
              .to.include.all.keys('duration').to.include({
                buildId: 'buildId',
                success: true,
                buildLog: `Cloning into 'build'...\nremote: Not Found\nfatal: repository 'https://github.com/repoName.git/' not found\n`
              });
          done();
          clearInterval(interval);
        }
      }, 300);
    }).catch((e) => {
      done(e);
    });
  });
});

