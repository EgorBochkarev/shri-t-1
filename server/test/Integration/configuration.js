const RestApi = require('./rest-api');
const {expect} = require('chai');
const {exec} = require('child_process');
const {clearMock, setConfig, getConfig} = require('../../mock/mock');
const {retryTill} = require('./utils');

let proc;

const config = {
  'repoName': 'EgorBochkarev/tire-fitting',
  'buildCommand': 'echo "finish"',
  'mainBranch': 'master',
  'period': 5
};

describe('Configuration api tests', () => {
  beforeEach(function(done) {
    proc = exec('npm run start-with-mock');
    retryTill((resolve) => {
      RestApi.checkHealth().then(() => {
        resolve();
        done();
      }).catch((e) => {
      });
    });
  });
  afterEach(function() {
    clearMock();
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
  it('Check set config', function(done) {
    RestApi.setConfig(config).then((settingsSet) => {
      expect(getConfig()).to.include(settingsSet);
      done();
    }).catch((e) => {
      done(e);
    });
  });
  it('Check deleting config', function(done) {
    setConfig({
      id: 'some',
      ...config
    });
    RestApi.deleteConfig().then(() => {
      expect(getConfig()).to.be.empty;
      done();
    }).catch((e) => {
      done(e);
    });
  });
});

