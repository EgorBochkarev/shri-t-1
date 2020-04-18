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
  it('Redirect to start page', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/')
        .waitForVisible('.informer')
        .assertView('start-page', '.page');
  });
  it('Start page shown', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start')
        .waitForVisible('.informer')
        .assertView('start-page', '.page');
  });
  it('Header check', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start')
        .waitForVisible('.informer')
        .assertView('start-page__header', '.header');
  });
  it('Footer check', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start')
        .waitForVisible('.informer')
        .assertView('start-page__footer', '.footer');
  });
  it('Body check', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start')
        .waitForVisible('.informer')
        .assertView('start-page__body', '.page__scrolled-container');
  });
  it('Click on header button', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start')
        .waitForVisible('.informer')
        .click('.header__tools .button')
        .waitForVisible('.form')
        .assertView('settings-page', '.page', {
          screenshotDelay: 500
        });
  });
  it('Click on main button', function() {
    // eslint-disable-next-line no-invalid-this
    return this.browser.url('/start')
        .waitForVisible('.informer')
        .click('.informer .button')
        .waitForVisible('.form')
        .assertView('settings-page', '.page');
  });
});
