const {exec} = require('child_process');
const RestApi = require('../rest-api');
const {retryTill} = require('../utils');
const {expect} = require('chai');

const historyPageOpened = (browser) => {
  return browser.url('/history').waitForVisible('.list');
};

let proc;
describe('Test history page', () => {
  beforeEach(function() {
    proc = exec('npm run mock');
    return retryTill((resolve) => {
      RestApi.checkHealth().then(() => {
        return RestApi.setConfig({
          'repoName': 'EgorBochkarev/tire-fitting',
          'buildCommand': 'echo "finish"',
          'mainBranch': 'master',
          'period': 5
        }).then(() => {
          resolve();
        });
      }).catch((e) => {});
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
  it('Check in progress build card', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386')
        .then(() => {
          return retryTill((resolve) => {
            RestApi.getBuild('IDn1').then((build) => {
              if (build.status === 'InProgress') {
                resolve();
              }
            }).catch((e) => {});
          });
        }).then(() => {
          return historyPageOpened(browser)
              .assertView('history-page__in-progress-card', '.card', {
                ignoreElements: ['.card__meta .extend-icon__label']
              });
        });
  });
  it('Check Success build card', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386')
        .then(() => {
          return retryTill((resolve) => {
            RestApi.getBuild('IDn1').then((build) => {
              if (build.status === 'Success') {
                resolve();
              }
            }).catch((e) => {});
          });
        }).then(() => {
          return historyPageOpened(browser)
              .assertView('history-page__success-card', '.card', {
                ignoreElements: ['.card__meta .extend-icon__label']
              });
        });
  });
  it('Check list of card', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return Promise.all([
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
    ]).then(() => {
      return historyPageOpened(browser)
          .assertView('history-page', '.page', {
            ignoreElements: ['.card']
          });
    });
  });
  it('Check list of card load more', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return Promise.all([
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
      RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386'),
    ]).then(() => {
      return historyPageOpened(browser)
          .click('.list__button')
          .elements('.card').then(({value}) => {
            expect(value.length).to.eql(20);
          });
    });
  });
});
