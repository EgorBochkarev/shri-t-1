const RestApi = require('./rest-api');
const {exec} = require('child_process');
const {expect} = require('chai');
const {clearMock, setConfig, setBuilds, getBuilds} = require('../../mock/mock');

let proc;

const config = {
  'id': 'confId',
  'repoName': 'EgorBochkarev/tire-fitting',
  'buildCommand': 'echo "finish"',
  'mainBranch': 'master',
  'period': 5
};
const firstBuild = {
  commitHash: '1933a6940a88d51e8850c8047e14b1df0d3ad386',
  commitMessage: 'last fixed',
  branchName: 'master',
  authorName: 'Vlad',
  id: 'IDn1',
  buildNumber: 1,
  status: 'Waiting',
  configurationId: config.id
};
const secondBuild = {
  commitHash: '1933a6940a88d51e8850c8047e14b1df0d3ad386',
  commitMessage: 'last fixed',
  branchName: 'master',
  authorName: 'Vlad',
  id: 'IDn2',
  configurationId: config.id,
  buildNumber: 2,
  status: 'Success'
};
const thirdBuild = {
  commitHash: '1933a6940a88d51e8850c8047e14b1df0d3ad386',
  commitMessage: 'last fixed',
  branchName: 'master',
  authorName: 'Vlad',
  id: 'IDn3',
  configurationId: config.id,
  buildNumber: 3,
  status: 'Success',
  buildLog: 'Test log'
};
const setOfBuilds = [
  firstBuild, secondBuild, thirdBuild, firstBuild,
  firstBuild, firstBuild, firstBuild, firstBuild
];
describe('Build api tests', () => {
  beforeEach(function(done) {
    proc = exec('npm run start-with-mock');
    const interval = setInterval(() => {
      RestApi.checkHealth().then(() => {
        clearInterval(interval);
        setConfig(config);
        done();
      }).catch((e) => {
      });
    }, 300);
  });
  afterEach(function() {
    clearMock();
    proc.kill();
  });
  it('Get empty build list', function(done) {
    RestApi.getBuilds().then((builds) => {
      expect(builds).to.be.empty;
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Run build', function(done) {
    RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386')
        .then((build) => {
          expect(build).to.include(firstBuild);
          expect(getBuilds()[0]).to.include(firstBuild);
          done();
        }).catch((e) => {
          done(e);
        });
  });
  it('Check build list', function(done) {
    setBuilds([firstBuild]);
    RestApi.getBuilds().then((builds) => {
      expect(builds).to.be.an('array').that.have.lengthOf(1);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check build', function(done) {
    setBuilds([firstBuild]);
    RestApi.getBuild('IDn1').then((build) => {
      expect(build).to.include(firstBuild);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Run severals builds', function(done) {
    Promise.all([
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('d4815eebecb74f5d123d1fd1175fff4cbce025c2'),
      RestApi.runBuild('414b46ff6652216a25d41f9b4521639b6c37b5a3'),
      RestApi.runBuild('a9d07f369d34b27fde419a71ad3b278041f53623'),
    ]).then(() => {
      expect(getBuilds()).to.be.an('array').that.have.lengthOf(4);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check limit in builds result', function(done) {
    setBuilds(setOfBuilds);
    RestApi.getBuilds(0, 3).then((builds) => {
      expect(builds).to.have.lengthOf(3);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check offset and limit in builds result', function(done) {
    setBuilds(setOfBuilds);
    RestApi.getBuilds(1, 2).then((builds) => {
      expect(builds).to.have.lengthOf(2);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check offset and limit in builds first elemen result', function(done) {
    setBuilds(setOfBuilds);
    RestApi.getBuilds(1, 2).then((builds) => {
      expect(builds[0]).to.include({
        id: 'IDn2',
        buildNumber: 2
      });
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check build logs', function(done) {
    setBuilds(setOfBuilds);
    RestApi.getBuildLog('IDn3').then((buildLog) => {
      expect(buildLog).to.eql('Test log');
      done();
    }).catch((e) => {
      done(e);
    });
  });
  describe('Checking build workflow', () => {
    it('Check build started', function(done) {
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386')
          .then(() => {
            const interval = setInterval(() => {
              RestApi.getBuild('IDn1').then((build) => {
                if (build.status === 'InProgress') {
                  clearInterval(interval);
                  expect(build).to.include({
                    ...firstBuild,
                    status: 'InProgress'
                  }).to.have.all.keys('start');
                  done();
                }
              }).catch((e) => {
                done(e);
              });
            }, 400);
          }).catch((e) => {
            done(e);
          });
    });
    it('Check build finished', function(done) {
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386')
          .then(() => {
            const interval = setInterval(() => {
              RestApi.getBuild('IDn1').then((build) => {
                if (build.status === 'Success') {
                  clearInterval(interval);
                  expect(build).to.include({
                    ...firstBuild,
                    status: 'Success'
                  }).to.have.all.keys('start', 'duration');
                  done();
                }
              }).catch((e) => {
                done(e);
              });
            }, 400);
          }).catch((e) => {
            done(e);
          });
    });
    it('Check recording builds logs', function(done) {
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386')
          .then(() => {
            const interval = setInterval(() => {
              RestApi.getBuild('IDn1').then((build) => {
                if (build.status === 'Success') {
                  clearInterval(interval);
                  return RestApi.getBuildLog('IDn1').then((buildLog) => {
                    // eslint-disable-next-line max-len
                    expect(buildLog).to.eql('Cloning into \'build\'...\nHEAD is now at 1933a69 last fixed\nfinish\n');
                    done();
                  });
                }
              }).catch((e) => {
                done(e);
              });
            }, 400);
          }).catch((e) => {
            done(e);
          });
    });
  });
});
