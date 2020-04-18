const {exec} = require('child_process');
const RestApi = require('../rest-api');

const historyPageOpened = (browser) => {
  return browser.url('/history').waitForVisible('.list');
};

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
        .assertView('history-page', '.page');
  });
  it('Header check', function() {
    // eslint-disable-next-line no-invalid-this
    return historyPageOpened(this.browser)
        .assertView('history-page__header', '.header');
  });
  it('Footer check', function() {
    // eslint-disable-next-line no-invalid-this
    return historyPageOpened(this.browser)
        .assertView('history-page__footer', '.footer');
  });
  it('Redirect to settings page', function() {
    // eslint-disable-next-line no-invalid-this
    return historyPageOpened(this.browser)
        .click('.header__tools .button:last-child')
        .waitForVisible('.form')
        .assertView('settings-page', '.page');
  });
  it('Pop-up appear', function() {
    // eslint-disable-next-line no-invalid-this
    return historyPageOpened(this.browser)
        .click('.header__tools .button')
        .waitForVisible('.pop-up__content')
        .assertView('history-page', '.page');
  });
  it('Close pop-up', function() {
    // eslint-disable-next-line no-invalid-this
    return historyPageOpened(this.browser)
        .click('.header__tools .button')
        .waitForVisible('.pop-up__content')
        .click('.pop-up__content .button:last-child')
        .assertView('history-page', '.page');
  });
  it('Run build', function() {
    // eslint-disable-next-line no-invalid-this
    return historyPageOpened(this.browser)
        .click('.header__tools .button')
        .waitForVisible('.pop-up__content')
        .setValue(
            '.pop-up__content .field__input',
            '1933a6940a88d51e8850c8047e14b1df0d3ad386'
        ).click('.pop-up__content .button')
        .waitForVisible('.card')
        .assertView('details-page', '.page', {
          ignoreElements: ['.card']
        });
  });
});
