const RestApi = require('./rest-api');
const {exec} = require('child_process');
const {expect} = require('chai');

let proc;
let configurationId;

const config = {
  'repoName': 'EgorBochkarev/tire-fitting',
  'buildCommand': 'echo "finish"',
  'mainBranch': 'master',
  'period': 5
};
describe('Build api tests', () => {
  before(function(done) {
    proc = exec('npm run mock');
    const interval = setInterval(() => {
      RestApi.checkHealth().then(() => {
        clearInterval(interval);
        console.log('Mock server ready');
        return RestApi.setConfig(config).then(({id}) => {
          configurationId = id;
          done();
        });
      }).catch((e) => {
      });
    }, 1000);
  });
  after(function() {
    proc.kill();
    console.log('Mock server killed');
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
          expect(build).to.include({
            commitHash: '1933a6940a88d51e8850c8047e14b1df0d3ad386',
            commitMessage: 'last fixed',
            branchName: 'master',
            authorName: 'Vlad',
            id: 'IDn1',
            buildNumber: 1,
            status: 'Waiting',
            configurationId
          });
          done();
        }).catch((e) => {
          done(e);
        });
  });
  it('Check build list', function(done) {
    RestApi.getBuilds().then((builds) => {
      expect(builds).to.be.an('array').that.have.lengthOf(1);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  // if build will be finished fuster it will fail....
  it('Check build', function(done) {
    RestApi.getBuild('IDn1').then((build) => {
      expect(build).to.include({
        commitHash: '1933a6940a88d51e8850c8047e14b1df0d3ad386',
        commitMessage: 'last fixed',
        branchName: 'master',
        authorName: 'Vlad',
        id: 'IDn1',
        configurationId,
        buildNumber: 1,
        status: 'InProgress'
      }).to.have.property('start');
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
    ]).then(() => RestApi.getBuilds().then((builds) => {
      expect(builds).to.be.an('array').that.have.lengthOf(5);
      done();
    })).catch((e) => {
      done(e);
    });
  });
  it('Check limit in builds result', function(done) {
    RestApi.getBuilds(0, 3).then((builds) => {
      expect(builds).to.have.lengthOf(3);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check offset and limit in builds result', function(done) {
    RestApi.getBuilds(1, 2).then((builds) => {
      expect(builds).to.have.lengthOf(2);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check offset and limit in builds first elemen result', function(done) {
    RestApi.getBuilds(1, 2).then((builds) => {
      expect(builds[0]).to.include({
        commitHash: '1933a6940a88d51e8850c8047e14b1df0d3ad386',
        id: 'IDn2',
        buildNumber: 2
      });
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check build finished', function(done) {
    const interval = setInterval(() => {
      RestApi.getBuild('IDn1').then((build) => {
        if (build.status !== 'InProgress') {
          clearInterval(interval);
          expect(build).to.include({
            commitHash: '1933a6940a88d51e8850c8047e14b1df0d3ad386',
            commitMessage: 'last fixed',
            branchName: 'master',
            authorName: 'Vlad',
            id: 'IDn1',
            configurationId,
            buildNumber: 1,
            status: 'Success'
          }).to.have.all.keys('start', 'duration');
          done();
        }
      }).catch((e) => {
        done(e);
      });
    }, 1000);
  });
});

