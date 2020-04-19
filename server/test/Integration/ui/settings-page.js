const {exec} = require('child_process');
const RestApi = require('../rest-api');
const {retryTill} = require('../utils');
const {expect} = require('chai');

const settingsPageOpened = (browser) => {
  return browser.url('/settings').waitForVisible('.form');
};

let proc;
describe('Test setting page', () => {
  beforeEach(function() {
    proc = exec('npm run mock');
    return retryTill((resolve) => {
      RestApi.checkHealth().then(() => {
        resolve();
      }).catch((e) => {});
    });
  });
  afterEach(function() {
    proc.kill();
  });
  it('Open settings without settings', function() {
    // eslint-disable-next-line no-invalid-this
    return settingsPageOpened(this.browser)
        .assertView('settings-page', '.page');
  });
  it('Open settings with settings', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return RestApi.setConfig({
      'repoName': 'EgorBochkarev/tire-fitting',
      'buildCommand': 'echo "finish"',
      'mainBranch': 'master',
      'period': 5
    }).then(() => {
      return settingsPageOpened(browser)
          .assertView('settings-page', '.page');
    });
  });
  it('Header check', function() {
    // eslint-disable-next-line no-invalid-this
    return settingsPageOpened(this.browser)
        .assertView('settings-page__header', '.header');
  });
  it('Footer check', function() {
    // eslint-disable-next-line no-invalid-this
    return settingsPageOpened(this.browser)
        .assertView('settings-page__footer', '.footer');
  });
  it('Check git hub repository field validation', function() {
    // eslint-disable-next-line no-invalid-this
    return settingsPageOpened(this.browser)
        .setValue(
            '.field__input[name="repoName"]',
            'test'
        )
        .leftClick('.field__input[name="buildCommand"]')
        .assertView('settings-page__repo-name-field',
            '.field__input[name="repoName"]');
  });
  it('Check build command field validation', function() {
    // eslint-disable-next-line no-invalid-this
    return settingsPageOpened(this.browser)
        .setValue(
            '.field__input[name="buildCommand"]',
            'some'
        )
        .leftClick('.field__input[name="repoName"]')
        .setValue(
            '.field__input[name="buildCommand"]',
            ''
        )
        .leftClick('.field__input[name="repoName"]')
        .assertView('settings-page__build-command-field',
            '.field__input[name="buildCommand"]');
  });
  it('Click cancel without settings', function() {
    // eslint-disable-next-line no-invalid-this
    return settingsPageOpened(this.browser)
        .click('.form__tools .button:last-child')
        .assertView('start-page', '.page');
  });
  it('Click cancel with settings', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return RestApi.setConfig({
      'repoName': 'EgorBochkarev/tire-fitting',
      'buildCommand': 'echo "finish"',
      'mainBranch': 'master',
      'period': 5
    }).then(() => {
      return settingsPageOpened(browser)
          .click('.form__tools .button:last-child')
          .assertView('history-page', '.page');
    });
  });
  it('Save settings', function() {
    // eslint-disable-next-line no-invalid-this
    return settingsPageOpened(this.browser)
        .setValue(
            '.field__input[name="repoName"]',
            'EgorBochkarev/tire-fitting'
        )
        .setValue(
            '.field__input[name="buildCommand"]',
            'echo "finish test"'
        )
        .setValue(
            '.field__input[name="mainBranch"]',
            'master'
        )
        .setValue(
            '.field__input[name="period"]',
            5
        )
        .click('.form__tools .button:first-child')
        .waitForVisible('.list')
        .then(() => RestApi.getConfig())
        .then((config) => {
          expect(config).to.include({
            repoName: 'EgorBochkarev/tire-fitting',
            buildCommand: 'echo "finish test"',
            mainBranch: 'master',
            period: 5
          }).to.have.property('id');
        });
  });
});
