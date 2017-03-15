'use strict';

const m = require('mochainon');
const angular = require('angular');
const units = require('../../../lib/shared/units');
const release = require('../../../lib/shared/release');
const settings = require('../../../lib/gui/models/settings');
require('angular-mocks');

describe('Browser: UpdateNotifier', function() {

  beforeEach(angular.mock.module(
    require('../../../lib/gui/components/update-notifier/update-notifier')
  ));

  describe('UpdateNotifierService', function() {

    describe('.shouldCheckForUpdates()', function() {

      let UpdateNotifierService;
      let UPDATE_NOTIFIER_SLEEP_DAYS;

      beforeEach(angular.mock.inject(function(_UpdateNotifierService_, _UPDATE_NOTIFIER_SLEEP_DAYS_) {
        UpdateNotifierService = _UpdateNotifierService_;
        UPDATE_NOTIFIER_SLEEP_DAYS = _UPDATE_NOTIFIER_SLEEP_DAYS_;
      }));

      describe('given a production release type', function() {

        beforeEach(function() {
          this.releaseType = release.RELEASE_TYPE.PRODUCTION;
        });

        describe('given the `sleepUpdateCheck` is disabled', function() {

          beforeEach(function() {
            settings.set('sleepUpdateCheck', false);
          });

          it('should return true', function() {
            const result = UpdateNotifierService.shouldCheckForUpdates(this.releaseType);
            m.chai.expect(result).to.be.true;
          });

        });

        describe('given the `sleepUpdateCheck` is enabled', function() {

          beforeEach(function() {
            settings.set('sleepUpdateCheck', true);
          });

          describe('given the `lastUpdateNotify` was never updated', function() {

            beforeEach(function() {
              settings.set('lastUpdateNotify', undefined);
            });

            it('should return true', function() {
              const result = UpdateNotifierService.shouldCheckForUpdates(this.releaseType);
              m.chai.expect(result).to.be.true;
            });

          });

          describe('given the `lastUpdateNotify` was very recently updated', function() {

            beforeEach(function() {
              settings.set('lastUpdateNotify', Date.now() + 1000);
            });

            it('should return false', function() {
              const result = UpdateNotifierService.shouldCheckForUpdates(this.releaseType);
              m.chai.expect(result).to.be.false;
            });

          });

          describe('given the `lastUpdateNotify` was updated long ago', function() {

            beforeEach(function() {
              const SLEEP_MS = units.daysToMilliseconds(UPDATE_NOTIFIER_SLEEP_DAYS);
              settings.set('lastUpdateNotify', Date.now() + SLEEP_MS + 1000);
            });

            it('should return true', function() {
              const result = UpdateNotifierService.shouldCheckForUpdates(this.releaseType);
              m.chai.expect(result).to.be.true;
            });

            it('should unset the `sleepUpdateCheck` setting', function() {
              m.chai.expect(settings.get('sleepUpdateCheck')).to.be.true;
              UpdateNotifierService.shouldCheckForUpdates(this.releaseType);
              m.chai.expect(settings.get('sleepUpdateCheck')).to.be.false;
            });

          });

        });

      });

      describe('given a snapshot release type', function() {

        beforeEach(function() {
          this.releaseType = release.RELEASE_TYPE.SNAPSHOT;
        });

        describe('given the `sleepUpdateCheck` is enabled', function() {

          beforeEach(function() {
            settings.set('sleepUpdateCheck', true);
          });

          describe('given the `lastUpdateNotify` was very recently updated', function() {

            beforeEach(function() {
              settings.set('lastUpdateNotify', Date.now() + 1000);
            });

            it('should return true', function() {
              const result = UpdateNotifierService.shouldCheckForUpdates(this.releaseType);
              m.chai.expect(result).to.be.true;
            });

          });

        });

      });

    });

  });

});
