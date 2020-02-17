/**
 * @otom/Input plugin
 *
 * @name Input
 * @author caias
 * @since 2019.09.06 - draft
 * @example
 *  const Input = require('@otom/input');
 *  const inputObj = new Input({
 *    // root container
 *    root: '[data-otom-el=container]',
 *    // input base element
 *    base: '[data-otom-el=input]',
 *    //  onchange callback
 *    onChange: () => {},
 *    // on blur callback
 *    onBlur: () => {},
 *    // exclude key callback
 *    onExclude: () => {},
 *  });
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('@otom/elements');

var _require = require('@otom/event'),
    KEYS = _require.KEYS,
    EVENTS = _require.EVENTS,
    isExclude = _require.isExclude;

/**
 * input attribute 모음
 */


var inputAttrs = {
  'autocomplete': 'off',
  'aria-expanded': 'false',
  'aria-autocomplete': 'list',
  'aria-haspopup': 'listbox',
  'role': 'combobox'
};

/**
 * Input properties
 * @memberof Input
 * @property {string} root container root
 * @property {string} base base container
 * @property {function} onChange on change callback
 * @property {function} onBlur on blur callback
 * @property {function} onExclude exclude key callback (enter, tab, up, down, esc)
 */
var defaultProps = {
  root: '[data-otom-el=container]',
  base: '[data-otom-el=input]',
  onChange: function onChange() {},
  onBlur: function onBlur() {},
  onExclude: function onExclude() {}
};

/**
 * 변환할 type별 function 모음
 */
var replaceFns = {
  // 이메일
  email: function email(target, text) {
    var arr = target.split('@');
    return arr[0] + '@' + text;
  }
};

var Input = function (_Element) {
  _inherits(Input, _Element);

  function Input() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Input);

    var props = Object.assign({}, defaultProps, opts);

    var _this = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props.base, props.root));

    _this.props = props;
    /**
     * input 이전값을 확인하기 위한 변수
     * @memberof Input
     * @type {string}
     */
    _this.preVal = null;
    /**
     * input이 focus 되어있는지에 대한 여부
     * @memberof Input
     * @type {boolean}
     */
    _this.isFocus = false;
    return _this;
  }

  /**
   * initialize
   *
   * @memberof Input
   */


  _createClass(Input, [{
    key: 'init',
    value: function init() {
      this.attr(inputAttrs);
      this.initHandler();
    }

    /**
     * input event Handler
     *
     * @memberof Input
     */

  }, {
    key: 'initHandler',
    value: function initHandler() {
      var _this2 = this;

      // focus
      this.base.addEventListener(EVENTS.FOCUS, function () {
        _this2.isFocus = true;
        _this2.props.onFocus();
      });

      // blur
      this.base.addEventListener(EVENTS.BLUR, function () {
        _this2.isFocus = false;
        _this2.props.onBlur();
      });

      // click event
      this.base.addEventListener(EVENTS.KEY_UP, function (e) {
        var keyCode = e.keyCode;
        var value = e.currentTarget.value;
        var isExcludeKey = isExclude(keyCode);

        // 제외할 key 및 해당 result가 open상태인 경우 callback 실행
        if (isExcludeKey) {
          if (keyCode === KEYS.ESC) {
            _this2.off();
            return;
          }

          if (_this2.isOpen()) {
            _this2.props.onExclude(keyCode);
          }
        }

        // callback내 data를 받아서 처리 (없는 경우 빈 array)      
        var data = _this2.props.onChange(value) || [];
        if (data.length) {
          _this2.on();
        } else {
          _this2.off();
        }
      });
    }

    /**
     * list가 open될시에 aria-expanded 값을 true로 변경한다.
     *
     * @memberof Input
     */

  }, {
    key: 'on',
    value: function on() {
      this.attr('aria-expanded', 'true');
    }

    /**
     * list가 close될시에 aria-expanded 값을 false로 변경한다.
     *
     * @memberof Input
     */

  }, {
    key: 'off',
    value: function off() {
      this.attr('aria-expanded', 'false');
    }

    /**
     * 현재 list가 열려있는지에 대한 여부를 반환한다.
     *
     * @memberof Input
     * @return {boolean} list 열려있는지에 대한 여부
     */

  }, {
    key: 'isOpen',
    value: function isOpen() {
      return JSON.parse(this.base.getAttribute('aria-expanded'));
    }

    /**
     * list상에 선택된 값을 input value값으로 변환한다.
     *
     * @param {string} text 선택된 항목의 텍스트
     * @param {string} type autocomplete type
     * @return {Input} input instance
     */

  }, {
    key: 'replace',
    value: function replace(text, type) {
      // replace 변수 추출
      var replaceFn = replaceFns[type];
      // replace 함수 없는 경우 기존 text 할당
      this.base.value = typeof replaceFn === 'function' ? replaceFn(this.base.value, text) : text;
      return this;
    }
  }]);

  return Input;
}(Element);

module.exports = Input;
