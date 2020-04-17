const {assert} = require('chai');
const {exec} = require('child_process');
const RestApi = require('../rest-api');

let proc;
describe('Test start page', () => {
  beforeEach(function() {
    proc = exec('npm run mock');
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        RestApi.checkHealth().then(() => {
          clearInterval(interval);
          resolve();
        }).catch();
      }, 1000);
    });
  });
  afterEach(function() {
    proc.kill();
  });
  it('Start page shown', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start').assertView('start-page', '.page');
  });
  it('Open settings button exist', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start')
        .isExisting('.button_type_action').then((exist) => {
          assert.ok(exist, 'Open settings button exist');
        });
  });
});
