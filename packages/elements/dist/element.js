/**
 * autocomplete elements 모듈
 *
 * @author caias
 * @contributors kern86
 * @since 2019.09.06 - draft
 * @example
 *  const Element = require('@otom/elements');
 *  // single module
 *  const element = new Element('input', 'div');
 *
 *  // use extends
 *  class El extends Element {
 *    constructor() {
 *      super(el, root);
 *    }
 *  }
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {
  function Element(el, root) {
    _classCallCheck(this, Element);

    this.root = document.querySelector(root);
    this.base = this.find(this.root, el)[0];
  }

  /**
   * element를 update한다.
   * @param {string|Element} [el] base로 바인딩하고자 하는 element
   */


  _createClass(Element, [{
    key: 'updateEl',
    value: function updateEl(el) {
      // element가 string인 경우, root에서 find를 통해 base를 바인딩
      if (typeof el === 'string') {
        this.base = this.find(this.root, el)[0];
        return;
      }

      // DOM element인 경우 base에 바로 할당
      this.base = el;
    }

    /**
     * attribute를 변경한다.
     * @param  {Array} args argument list
     * @example
     *  this.attr('aria-expanded', 'false');
     */

  }, {
    key: 'attr',
    value: function attr() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.updateProps.apply(this, [].concat(args, ['attr']));
    }

    /**
     * attribute를 삭제한다.
     * @param {Array} args argument list
     * @example
     *  this.removeAttr('aria-expanded');
     */

  }, {
    key: 'removeAttr',
    value: function removeAttr() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.updateProps.apply(this, [].concat(args, ['removeAttr']));
    }

    /**
     * css를 변경한다.
     * @param  {Array} args argument list
     * @example
     *  this.css('top', '30px');
     */

  }, {
    key: 'css',
    value: function css() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.updateProps.apply(this, [].concat(args, ['css']));
    }

    /**
     * argumentlist에 따라서 property를 변경한다.
     * @param  {Array} args property를 변경할 argument list
     * @return {Element} element instance
     */

  }, {
    key: 'updateProps',
    value: function updateProps() {
      var type = void 0;
      // argument length에 따른 분기
      switch (arguments.length) {
        // 2개 - ([{key: value}]), type
        case 2:
          var list = arguments.length <= 0 ? undefined : arguments[0];
          type = arguments.length <= 1 ? undefined : arguments[1];
          this.getFn(type, true).call(this, list);
          break;
        // 3개 - key, value, type
        case 3:
          var key = arguments.length <= 0 ? undefined : arguments[0];
          var value = arguments.length <= 1 ? undefined : arguments[1];
          type = arguments.length <= 2 ? undefined : arguments[2];
          this.getFn(type, false).call(this, key, value);
          break;
        default:
      }

      return this;
    }

    /**
     * property를 update할 function을 반환한다.
     *
     * @param {string} type property update type
     * @param {boolean} isList list (type array) 여부
     * @return {Function} update할 function
     */

  }, {
    key: 'getFn',
    value: function getFn(type) {
      var isList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      switch (type) {
        case 'css':
          var cssFn = isList ? this.setStyleList : this.setStyle;
          return cssFn;
          break;
        case 'attr':
          var attrFn = isList ? this.setAttrList : this.setAttr;
          return attrFn;
          break;
        case 'removeAttr':
          var removeFn = isList ? this.removeAttrList : this.removeAttr;
          return removeFn;
          break;
        default:
          return function () {};
          break;
      }
    }

    /**
     * object의 key, value값을 attribute로 업데이트한다.
     * @param {Object} list update할 list object
     */

  }, {
    key: 'setAttrList',
    value: function setAttrList() {
      var _this = this;

      var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.keys(list).forEach(function (key) {
        return _this.setAttr(key, list[key]);
      });
    }

    /**
     * 단일 key, value의 attribute를 업데이트 한다.
     * @param {string} key 업데이트할 attribute key
     * @param {*} value 업데이트할 value
     */

  }, {
    key: 'setAttr',
    value: function setAttr(key, value) {
      this.base.setAttribute(key, value);
    }

    /**
     * object의 key, value값을 style로 업데이트한다.
     * @param {Object} list update할 list object
     */

  }, {
    key: 'setStyleList',
    value: function setStyleList() {
      var _this2 = this;

      var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.keys(list).forEach(function (key) {
        return _this2.setStyle(key, list[key]);
      });
    }

    /**
     * 단일 key, value의 style를 업데이트 한다.
     * @param {string} key 업데이트할 attribute key
     * @param {*} value 업데이트할 value
     */

  }, {
    key: 'setStyle',
    value: function setStyle(key, value) {
      this.base.style[key] = value;
    }

    /**
     * object의 key, value값을 attribute 모음을 제거한다.
     * @param {Object} list update할 list object
     */

  }, {
    key: 'removeAttrList',
    value: function removeAttrList() {
      var _this3 = this;

      var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      list.forEach(function (key) {
        return _this3.removeAttr(key);
      });
    }

    /**
     * object의 key, value값을 attribute를 제거한다.
     * @param {Object} key 제거할 key
     */

  }, {
    key: 'removeAttr',
    value: function removeAttr(key) {
      this.base.removeAttribute(key);
    }

    /**
     * target에 대한 selector를 찾는다.
     * @param {Element} target 부모 element
     * @param {string} selector target 에서 찾고자 하는 selector
     * @return {Element} select된 element
     */

  }, {
    key: 'find',
    value: function find(target, selector) {
      return target.querySelectorAll(selector);
    }

    /**
     * target에 element를 append한다.
     *
     * @param {Element} target append할 target
     * @param {string} htmlStr append할 child element string
     * @param {Function} [callback = () => {}] append후 호출할 callback
     * @return {Element} element instance
     */

  }, {
    key: 'append',
    value: function append(target, htmlStr, callback) {
      var _convertDom = this.convertDom(htmlStr),
          count = _convertDom.count,
          children = _convertDom.children;
      // count를 loop돌며 append child 실행


      for (var idx = 0; idx < count; idx++) {
        target.appendChild(children[idx]);
      }

      callback(htmlStr);
      return this;
    }

    /**
     * html string내 정보를 반환한다.
     * @param {string} htmlStr convert할 html string
     * @returns {number} count childelement count
     * @returns {Element} children child element
     */

  }, {
    key: 'convertDom',
    value: function convertDom(htmlStr) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = htmlStr;

      return {
        count: wrapper.childElementCount,
        children: wrapper.children
      };
    }
  }]);

  return Element;
}();

module.exports = Element;
