/*
 * Copyright 2016 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const _ = require('lodash');
const units = require('../../../../shared/units');
const release = require('../../../../shared/release');
const settings = require('../../../models/settings');

module.exports = function(ModalService, UPDATE_NOTIFIER_SLEEP_DAYS) {

  /**
   * @summary Check if we should allow putting the update notifier to sleep
   * @function
   * @private
   *
   * @param {String} releaseType - release type
   * @returns {Boolean} whether sleep is allowed
   *
   * if (shouldAllowSleep(release.RELEASE_TYPE.PRODUCTION)) {
   *   console.log('We can allow the user to put the update notifier to sleep');
   * }
   */
  const shouldAllowSleep = (releaseType) => {
    return releaseType === release.RELEASE_TYPE.PRODUCTION;
  };

  /**
   * @summary Determine if its time to check for updates
   * @function
   * @public
   *
   * @param {String} releaseType - release type
   * @returns {Boolean} should check for updates
   *
   * @example
   * if (UpdateNotifierService.shouldCheckForUpdates(release.RELEASE_TYPE.PRODUCTION)) {
   *   console.log('We should check for updates!');
   * }
   */
  this.shouldCheckForUpdates = (releaseType) => {
    const lastUpdateNotify = settings.get('lastUpdateNotify');

    if (!settings.get('sleepUpdateCheck') || !lastUpdateNotify || !shouldAllowSleep(releaseType)) {
      return true;
    }

    if (lastUpdateNotify - Date.now() > units.daysToMilliseconds(UPDATE_NOTIFIER_SLEEP_DAYS)) {
      settings.set('sleepUpdateCheck', false);
      return true;
    }

    return false;
  };

  /**
   * @summary Open the update notifier widget
   * @function
   * @public
   *
   * @param {String} version - version
   * @returns {Promise}
   *
   * @example
   * UpdateNotifierService.notify('1.0.0-beta.16');
   */
  this.notify = (version) => {
    return ModalService.open({
      template: './components/update-notifier/templates/update-notifier-modal.tpl.html',
      controller: 'UpdateNotifierController as modal',
      size: 'update-notifier',
      resolve: {
        options: _.constant({
          version,
          allowsSleep: shouldAllowSleep(release.getReleaseType(version))
        })
      }
    }).result;
  };

};
