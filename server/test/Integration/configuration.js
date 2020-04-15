const RestApi = require('./rest-api');
const {exec} = require('child_process');
const {expect} = require('chai');

let proc;

const config = {
  'repoName': 'EgorBochkarev/tire-fitting',
  'buildCommand': 'echo "finish"',
  'mainBranch': 'master',
  'period': 5
};
describe('Configuration api tests', () => {
  before(function(done) {
    proc = exec('npm run mock');
    const interval = setInterval(() => {
      RestApi.checkHealth().then(() => {
        clearInterval(interval);
        done();
      }).catch((e) => {
      });
    }, 1000);
  });
  after(function() {
    proc.kill();
  });
  it('Check empty config return', function(done) {
    RestApi.getConfig().then((settings) => {
      expect(settings).to.be.empty;
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check set config response', function(done) {
    RestApi.setConfig(config).then((settingsSet) => {
      expect(settingsSet).to.include(config).to.have.property('id');
      done();
    }).catch((e) => {
      done(e);
    });
  });
  // Next test is reliable on previos one, it's bad practice;
  it('Check set config', function(done) {
    RestApi.getConfig().then((settingsGet) => {
      expect(settingsGet).to.include(config).to.have.property('id');
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check deleting config', function(done) {
    RestApi.deleteConfig().then(() => RestApi.getConfig().then((settings) => {
      expect(settings).to.be.empty;
      done();
    })).catch((e) => {
      done(e);
    });
  });
});

