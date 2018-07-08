'use strict';

import $ from 'jquery';

import { Plugin } from 'foundation-sites/js/foundation.plugin';

import { Touch } from 'foundation-sites/js/foundation.util.touch';

import { Triggers } from 'foundation-sites/js/foundation.util.triggers';

/**
 * Notification module.
 * @module foundation.reveal
 * @requires foundation.util.triggers
 * @requires foundation.util.motion if using animations
 */

class Notification extends Plugin {
  /**
   * Creates a new instance of Notification.
   * @class
   * @name Reveal
   * @param {String} message - The notification message. Can be HTML.
   * @param {String} level - A level from the levels map. Default is Notification.LEVELS.NONE.
   */
  _setup(message, level) {
    this.level = level || Notification.LEVELS.NONE;
    this.message = message;
    this.className = 'Notification'; // ie9 back compat
    this._init();

    Touch.init($);
    Triggers.init($);

  }

  /**
   * Initializes the notification by adding it to a 
   * @private
   */
  _init() {
    this.$element = $(`<div class="${this.level} callout notification">
      ${this.message}<a href="#" class="close">&times;</a>
    </div>`);
    let notifications = $('#notifications');
    if(notifications.length === 0) {
      notifications = $('<div id="notifications"></div>');
      $('body').append(notifications);
    }
    notifications.append(this.$element);
    this._events();
  }

  /**
   * Adds event handlers for the notification.
   * @private
   */
  _events() {
    let _this = this;
    this.$element.find('.close').on('click', () => _this.close());
    setTimeout(() => _this.close(), Notification.TIMEOUT);
  }

  /**
   * Closes the notification.
   * @private
   */
  close() {
    let _this = this;
    this.$element.css('opacity', 0);
    setTimeout(() => _this.$element.detach(), 600)
  }

  /**
   * Destroys an instance of a notification.
   * @function
   */
  _destroy() {
    this.close();
  };
}

Notification.LEVELS = {
  NONE: 'secondary',
  ERROR: 'alert',
  WANRING: 'warning',
  SUCCESS: 'success'
}

Notification.TIMEOUT = 5000;

export {Notification};
