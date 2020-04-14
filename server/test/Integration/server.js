const RestApi = require('./rest-api');
const {exec} = require('child_process');
const {expect} = require('chai');

let proc;
describe('Integration test', () => {
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
  it('Check set config', function(done) {
    RestApi.getConfig().then((settings) => {
      expect(settings).to.be.empty;
      done();
    }).catch((e) => {
      done(e);
    });
  });
});

