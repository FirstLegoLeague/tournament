'use strict';

import $ from 'jquery';

import { Plugin } from 'foundation-sites/js/foundation.plugin';

import { Touch } from 'foundation-sites/js/foundation.util.touch';

import { Triggers } from 'foundation-sites/js/foundation.util.triggers';
/**
 * Hamburger module.
 * @module foundation.hamburger
 * @requires foundation.util.triggers
 * @requires foundation.util.touch
 */

class Hamburger extends Plugin {
  /**
   * Creates a new instance of a hamburger control.
   * @class
   * @name Hamburger
   * @param {jQuery} element - jQuery object to make into a hamburger control.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  _setup(element) {
    this.$element = element;

  // Touch and Triggers inits are idempotent, we just need to make sure it's initialied.
    Touch.init($);
    Triggers.init($);

    this.className = 'Hamburger'; // ie9 back compat
    this._init();
  }

  /**
   * Initilizes the plugin by reading/setting attributes, creating collections and setting the initial position of the handle(s).
   * @function
   * @private
   */
  _init() {
    this._events();
  }

  /**
   * Adds event listeners to the hamburger elements.
   * @function
   * @private
   */
  _events() {
    this.$element.click(event => {
      $(event.currentTarget).toggleClass('is-active');
    })
  }

  /**
   * Destroys the hamburger plugin.
   */
  _destroy() {
    this.$element.off();
  }
}

export {Hamburger};
