const makeServiceWorkerEnv = require('service-worker-mock');
const {assert, expect} = require('chai');
const sinon = require('sinon');

describe('Service worker', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv(), {
      fetch: sinon.stub().resolves({
        clone: () => {
          return {
            test: 'test'
          };
        }
      })
    });
    delete require.cache[require.resolve('../../../client/src/sw')];
    require('../../../client/src/sw');
  });
  it('should add listeners', () => {
    assert(
        self.listeners.get('install'),
        'Service worker are not handle install event'
    );
    assert(
        self.listeners.get('activate'),
        'Service worker are not handle activat event'
    );
    assert(
        self.listeners.get('fetch'),
        'Service worker are not handle fetch event'
    );
  });
  it('should delete old caches on activate', async () => {
    // Create old cache
    await self.caches.open('OLD_CACHE');
    assert(self.snapshot().caches.OLD_CACHE, 'Old cache is not created');

    // Activate and verify old cache is removed
    await self.trigger('install');
    await self.trigger('activate');
    assert(!self.snapshot().caches.OLD_CACHE, 'Old cache still exist');
    assert(self.snapshot().caches['ci-build-v1'], 'New cache created');
  });
  it('should not cache api', async () => {
    // Create old cache
    await self.trigger('install');
    await self.trigger('activate');
    await self.trigger('fetch', 'httt://host/api/some-api');

    assert(self.snapshot().caches['ci-build-v1'], 'New cache created');
  });
  it('should cache other requests', async () => {
    // Create old cache
    await self.trigger('install');
    await self.trigger('activate');

    const url = 'httt://host/some';
    await self.trigger('fetch', url);
    expect(self.snapshot().caches['ci-build-v1'][url]).to.include({
      test: 'test'
    });
  });
});
