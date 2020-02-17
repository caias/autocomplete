'use strict';

/**
 * event 모음
 * @type {Object}
 */

var EVENTS = {
  CHANGE: 'change',
  KEY: 'keypress',
  KEY_UP: 'keyup',
  KEY_DOWN: 'keydown',
  BLUR: 'blur',
  CLICK: 'click',
  SELECT: 'select',
  FOCUS: 'focus'
};

/**
 * keycode 모음
 * @type {Object}
 */
var KEYS = {
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  FN: 91,
  TAB: 9,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

/**
 * 관련 keycode가 제외할 범주에 속하는지 확인한다.
 * @param {number} key keycode
 * @return {boolean} keycode 해당 여부
 */
function isExclude(key) {
  var exclude = [KEYS.ENTER, KEYS.ESC, KEYS.UP, KEYS.DOWN, KEYS.TAB];
  return exclude.some(function (code) {
    return key === code;
  });
}

module.exports = {
  isExclude: isExclude,
  KEYS: KEYS,
  EVENTS: EVENTS
};
