const {exec} = require('child_process');
const RestApi = require('../rest-api');
const {retryTill} = require('../utils');
const {expect} = require('chai');

const buildPageOpened = (browser) => {
  return browser.url('/build/IDn1').waitForVisible('.card');
};

let proc;
describe('Test build page', () => {
  beforeEach(function() {
    proc = exec('npm run mock');
    return retryTill((resolve) => {
      RestApi.checkHealth().then(() =>
        RestApi.setConfig({
          'repoName': 'EgorBochkarev/tire-fitting',
          'buildCommand': 'echo "finish"',
          'mainBranch': 'master',
          'period': 5
        }).then(
            () => RestApi.runBuild('1933a6940a88d51e8850c8047e14b1df0d3ad386')
        ).then(resolve)
      ).catch((e) => {});
    });
  });
  afterEach(function() {
    proc.kill();
  });
  it('Open build page', function() {
    // eslint-disable-next-line no-invalid-this
    return buildPageOpened(this.browser)
        .assertView('build-page', '.page', {
          ignoreElements: ['.card__meta .extend-icon__label']
        });
  });
  it('Header check', function() {
    // eslint-disable-next-line no-invalid-this
    return buildPageOpened(this.browser)
        .assertView('build-page__header', '.header');
  });
  it('Footer check', function() {
    // eslint-disable-next-line no-invalid-this
    return buildPageOpened(this.browser)
        .assertView('build-page__footer', '.footer');
  });
  it('Check settings button', function() {
    // eslint-disable-next-line no-invalid-this
    return buildPageOpened(this.browser)
        .click('.header__tools .button:last-child')
        .waitForVisible('.form');
  });
  it('Check rebuild button', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return buildPageOpened(browser)
        .click('.header__tools .button:first-child')
        .waitForVisible('.card').then(async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return browser.getUrl();
        }).then((url) => {
          expect(url.match(/\/build\/(.*)/)[1]).to.not.eql(('IDn1'));
        });
  });
  it('Check build card', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return retryTill((resolve) => {
      RestApi.getBuild('IDn1').then((build) => {
        if (build.status === 'Success') {
          resolve();
        }
      }).catch((e) => {});
    }).then(() => {
      return buildPageOpened(browser).assertView('build-page__card', '.card', {
        ignoreElements: ['.card__meta .extend-icon__label']
      });
    });
  });
  it('Check build log', function() {
    // eslint-disable-next-line no-invalid-this
    const browser = this.browser;
    return retryTill((resolve) => {
      RestApi.getBuild('IDn1').then((build) => {
        if (build.status === 'Success') {
          resolve();
        }
      }).catch((e) => {});
    }).then(() => {
      return buildPageOpened(browser).assertView(
          'build-page__log',
          '.content.content_type_main.content_full-adaptive'
      );
    });
  });
});
