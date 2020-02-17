/**
 * autocomplete reulst list 모듈
 *
 * @author caias
 * @contributors kern86
 * @since 2019.09.06 - draft
 * @example
 *  const Result = require('@otom/result');
 *  const result = new Result({
 *
 *  });
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('@otom/elements');

var _require = require('@otom/event'),
    KEYS = _require.KEYS,
    EVENTS = _require.EVENTS;

/**
 * result container DOM attribute
 */


var resultAttrs = {
  'aria-atomic': 'true',
  'aria-live': 'assertive',
  'role': 'listbox'
};

/**
 * defaultProps
 * @memberof Result
 * @type {Object}
 * @property {function} listTmpl list template
 * @property {string} root root container
 * @property {string} container result container
 * @property {string} activeClass active class
 * @property {function} onResultSelected result selected callback
 */
var defaultProps = {
  listTmpl: null,
  root: '[data-otom-el=container]',
  container: '[data-otom-el=result]',
  activeClass: '',
  onResultSelected: function onResultSelected() {}
};

/**
 * Result
 * @memberof result
 *
 */

var Result = function (_Element) {
  _inherits(Result, _Element);

  function Result() {
    var _this$keyHandler;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Result);

    var props = Object.assign({}, defaultProps, opts);
    // Element Class 상속

    // props
    var _this = _possibleConstructorReturn(this, (Result.__proto__ || Object.getPrototypeOf(Result)).call(this, props.container, props.root));

    _this.props = props;
    /**
     * list template
     * @memberof Result
     * @type {function}
     */
    _this.listTmpl = _this.props.listTmpl;
    /**
     * result data index
     * @memberof Result
     * @type {number}
     */
    _this.index = -1;

    /**
     * keyHandler function 모음
     * @memberof Result
     * @type {Object}
     */
    _this.keyHandler = (_this$keyHandler = {}, _defineProperty(_this$keyHandler, KEYS.DOWN, function () {
      _this.keyboardMove(_this.index, 'next');
    }), _defineProperty(_this$keyHandler, KEYS.UP, function () {
      _this.keyboardMove(_this.index, 'prev');
    }), _defineProperty(_this$keyHandler, KEYS.ESC, function () {
      _this.remove();
    }), _defineProperty(_this$keyHandler, KEYS.ENTER, function () {
      _this.enterHandler();
    }), _defineProperty(_this$keyHandler, KEYS.TAB, function (isShift) {
      _this.keyboardMove(_this.index, isShift ? 'prev' : 'next');
    }), _this$keyHandler);
    return _this;
  }

  /**
   * initiailize
   * @memberof Result
   */


  _createClass(Result, [{
    key: 'init',
    value: function init() {
      this.setAttrList(resultAttrs);
    }

    /**
     * data 존재 유무에 따라 item update 또는 remove한다.
     *
     * @memberof Result
     * @param {data} data regexp matched data
     */

  }, {
    key: 'update',
    value: function update(data) {
      this.data = data;
      if (data.length) {
        // data가 존재하는 경우 add
        this.add(data);
        this.index = -1;
        // 존재하지 않는 경우 remove
      } else {
        this.remove();
      }
    }

    /**
     * data가 있을 시에 아이템을 업데이트 한다
     *
     * @memberof Result
     * @param {Array} data regexp matched data
     */

  }, {
    key: 'add',
    value: function add(data) {
      var _this2 = this;

      // display data list 생성
      var dispList = data.map(function (item) {
        return item.dispVal;
      });
      // handlebars list 생성
      var list = this.listTmpl({ data: dispList });
      // list append
      this.remove().append(this.base, list, function () {
        _this2.clickHandler();
      });
    }

    /**
     * data가 없을시에 container안에 돔을 초기화 한다.
     *
     * @memberof Result
     * @return {Result} result instance
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.base.innerHTML = '';
      this.index = -1;
      return this;
    }

    /**
     * Target에 대한 class event를 제어한다.
     *
     * @memberof Result
     * @param {Element} el element
     * @param {string} type event type
     */

  }, {
    key: 'handleClass',
    value: function handleClass(el, type) {
      var className = this.props.activeClass;

      if (!className) {
        return;
      }

      if (el.classList) {
        el.classList[type](className);
      } else {
        if (type === 'add') {
          el.className += ' ' + className;
        } else {
          el.className -= ' ' + className;
        }
      }
    }

    /**
     * 결과 리스트 Click event
     *
     * @memberof Result
     */

  }, {
    key: 'clickHandler',
    value: function clickHandler() {
      var _this3 = this;

      var items = Array.from(document.querySelectorAll('[aria-selected]'));

      items.forEach(function (anchor, idx) {
        anchor.addEventListener(EVENTS.CLICK, function (e) {
          var target = e.currentTarget;
          _this3.reset();
          target.setAttribute('aria-selected', 'true');
          _this3.handleClass(target, 'add');
          _this3.props.onResultSelected(_this3.getData(idx));
        });
      });
    }

    /**
     * 현재 선택된 결과 리스트의 aria-selected를 초기화 한다 .
     *
     * @memberof Result
     * @param {Function} callback 초기화 후에 실행 시킬 callback 함수
     */

  }, {
    key: 'reset',
    value: function reset() {
      var _this4 = this;

      var items = Array.from(document.querySelectorAll('[aria-selected]'));

      items.forEach(function (item) {
        item.setAttribute('aria-selected', 'false');
        _this4.handleClass(item, 'remove');
      });
    }

    /**
     * 결과 리스트 Enter Event
     *
     * @memberof Result
     */

  }, {
    key: 'enterHandler',
    value: function enterHandler() {
      if (!this.isSelected()) {
        return;
      }
      this.props.onResultSelected(this.getData(this.index));
    }

    /**
     * 키보드 DOWN시 다음 인덱스를 반환 한다
     *
     * @memberof Result
     * @param {number} index 현재 index number
     * @param {number} count 갱신된 item 갯수
     * @return {number} next item index
     */

  }, {
    key: 'nextIndex',
    value: function nextIndex(index, count) {
      return index < count ? this.index + 1 : 0;
    }

    /**
     * 키보드 UP시 이전 인덱스를 반환 한다
     *
     * @memberof Result
     * @param {number} index 현재 index number
     * @param {number} count 갱신된 item 갯수
     * @return {number} prev item index
     */

  }, {
    key: 'prevIndex',
    value: function prevIndex(index, count) {
      this.index = index === -1 ? -1 : index - 1;
      return this.index === -1 ? count : this.index;
    }

    /**
     * 키보드 UP/DOWN 이벤트 핸들러
     * 키보드 제어시 스크롤이 있을시 활성화 index에 맞게 스크롤 제어
     *
     * @memberof Result
     * @param {number} index 현재 index number
     * @param {string} type {next | prev} 다음 아이템 또는 이전 아이템
     */

  }, {
    key: 'keyboardMove',
    value: function keyboardMove(index, type) {
      var items = document.querySelectorAll('[aria-selected]');
      var ul = this.root.querySelector('ul');
      var ulHeight = ul.offsetHeight;
      var liHeight = items[0].offsetHeight;
      var itemCount = items.length - 1;

      if (this.isSelected()) {
        items[index].setAttribute('aria-selected', 'false');
        this.handleClass(items[index], 'remove');
      }

      this.index = this[type + 'Index'](index, itemCount);
      items[this.index].setAttribute('aria-selected', 'true');
      items[this.index].focus();
      this.handleClass(items[this.index], 'add');
      ul.scrollTop = items[this.index].offsetTop - ulHeight + liHeight;
    }

    /**
     * keycode에 맞는 이벤트를 바인딩 한다.
     *
     * @memberof Result
     * @param {number} key event keyCode
     * @param {boolean} isShift shift key 입력 여부
     */

  }, {
    key: 'keyboardHandler',
    value: function keyboardHandler(key, isShift) {
      var targetFn = this.keyHandler[key];
      typeof targetFn === 'function' && targetFn(isShift);
    }

    /**
     * 결과 리스트 중에 선택된 아이템이 있는지에 대한 여부 반환
     *
     * @memberof Result
     * @return {boolean} 활성화 여부
     */

  }, {
    key: 'isSelected',
    value: function isSelected() {
      return this.index > -1;
    }

    /**
     * 결과 리스트 선택시 아이템 index 반환
     *
     * @memberof Result
     * @param {number} idx 아이템 index
     * @return {number} 선택된 아이템 index
     */

  }, {
    key: 'getData',
    value: function getData(idx) {
      var target = this.data[idx];

      return target.value;
    }
  }]);

  return Result;
}(Element);

module.exports = Result;
