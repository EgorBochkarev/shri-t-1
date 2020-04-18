const {exec} = require('child_process');
const RestApi = require('../rest-api');

let proc;
describe('Test history page', () => {
  beforeEach(function() {
    proc = exec('npm run mock');
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        RestApi.checkHealth().then(() => {
          clearInterval(interval);
          return RestApi.setConfig({
            'repoName': 'EgorBochkarev/tire-fitting',
            'buildCommand': 'echo "finish"',
            'mainBranch': 'master',
            'period': 5
          }).then(() => {
            resolve();
          });
        }).catch();
      }, 1000);
    });
  });
  afterEach(function() {
    proc.kill();
  });
  it('Redirect to history page', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/')
        .waitForVisible('.list')
        .assertView('start-page', '.page');
  });
});
