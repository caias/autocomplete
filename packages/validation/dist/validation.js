/**
 * autocomplete valdation 모듈
 *
 * @author caias
 * @since 2019.09.06 - draft
 * @example
 *  const valdation = require('@otom/validation');
 */

'use strict';

/**
 * 이메일 타입에 따른 '@기준' index를 반환한다.
 * @type {Object}
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var validFns = {
  /**
   * email function
   * @param {string} val value
   * @return {boolean} index 여부
   */
  email: function email(val) {
    return val.indexOf('@') > 0;
  }
};

/**
 * 비교할 regexp값을 반환한다.
 * @type {Object}
 */
var regexFns = {
  /**
   * email function
   * @param {string} val value
   * @return {Object} 비교할 단어
   */
  email: function email(val) {
    var charCheck = val.indexOf('@') + 1;
    var regex = val.slice(charCheck);
    return regex;
  },

  /**
   * default function
   * @param {string} val value
   * @return {Object} default text
   */
  'default': function _default(val) {
    return new RegExp(val);
  }
};

/**
 * type에 따른 validation을 체크한다.
 * @param {string | number} val value
 * @param {string} type autocomplete type
 * @return {boolean} valdation 결과
 */
function isValid(val, type) {
  var validFn = validFns[type];

  if (!(typeof validFn === 'function')) {
    return false;
  }

  return validFn(val);
}

/**
 * matching 되는 Data값들을 반환한다.
 * @param {*} val value
 * @param {*} type autocomplete type
 * @param {*} data 비교할 Data
 * @return {Array} matching된 Data를 반환한다.
 */
function getMatchted(val, type, data) {
  // validation 실패시 빈 array 반환
  if (!isValid(val, type)) {
    return [];
  }

  var regexFn = regexFns[type];
  // regexFn이 함수가 아니라면 빈 array 반환
  if (!(typeof regexFn === 'undefined' ? 'undefined' : _typeof(regexFn)) === 'function') {
    return [];
  }

  var regex = regexFn(val);
  var startCheck = val.indexOf('@') + 1 === val.length;

  // 비교할 regexp가 없고 @이후에 문자가 있다면 빈 array 반환
  if (!startCheck && !regex) {
    return [];
  }

  return data.filter(function (v) {
    return v.indexOf(regex) === 0;
  });
}

module.exports = {
  getMatchted: getMatchted
};
