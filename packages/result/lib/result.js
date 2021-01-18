/**
 * autocomplete reulst list 모듈
 *
 * @author caias
 * @contributors caias
 * @since 2019.09.06 - draft
 * @example
 *  const Result = require('@otom/result');
 *  const result = new Result({
 *
 *  });
 */

'use strict';

const Element = require('@otom/elements');
const { KEYS, EVENTS } = require('@otom/event');

/**
 * result container DOM attribute
 */
const resultAttrs = {
  'aria-atomic': 'true',
  'aria-live': 'assertive',
  'role': 'listbox',
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
const defaultProps = {
  listTmpl: null,
  root: '[data-otom-el=container]',
  container: '[data-otom-el=result]',
  activeClass: '',
  onResultSelected: () => {},
};

/**
 * Result
 * @memberof result
 *
 */
class Result extends Element {
  constructor(opts = {}) {
    const props = Object.assign({}, defaultProps, opts);
    // Element Class 상속
    super(props.container, props.root);
    // props
    this.props = props;
    /**
     * list template
     * @memberof Result
     * @type {function}
     */
    this.listTmpl = this.props.listTmpl;
    /**
     * result data index
     * @memberof Result
     * @type {number}
     */
    this.index = -1;

    /**
     * keyHandler function 모음
     * @memberof Result
     * @type {Object}
     */
    this.keyHandler = {
      // cursor down
      [KEYS.DOWN]: () => {
        this.keyboardMove(this.index, 'next');
      },
      // cursor up
      [KEYS.UP]: () => {
        this.keyboardMove(this.index, 'prev');
      },
      // esc
      [KEYS.ESC]: () => {
        this.remove();
      },
      // enter
      [KEYS.ENTER]: () => {
        this.enterHandler();
      },
      // tab
      [KEYS.TAB]: (isShift) => {
        this.keyboardMove(this.index, isShift ? 'prev' : 'next');
      },
    };
  }

  /**
   * initiailize
   * @memberof Result
   */
  init() {
    this.setAttrList(resultAttrs);
  }

  /**
   * data 존재 유무에 따라 item update 또는 remove한다.
   *
   * @memberof Result
   * @param {data} data regexp matched data
   */
  update(data) {
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
  add(data) {
    // display data list 생성
    const dispList = data.map((item) => {
      return item.dispVal;
    });
    // handlebars list 생성
    const list = this.listTmpl({ data: dispList });
    // list append
    this
      .remove()
      .append(this.base, list, () => {
        this.clickHandler();
      });
  }

  /**
   * data가 없을시에 container안에 돔을 초기화 한다.
   *
   * @memberof Result
   * @return {Result} result instance
   */
  remove() {
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
  handleClass(el, type) {
    const className = this.props.activeClass;

    if (!className) { return; }

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
  clickHandler() {
    const items = Array.from(document.querySelectorAll('[aria-selected]'));

    items.forEach((anchor, idx) => {
      anchor.addEventListener(EVENTS.CLICK, (e) => {
        const target = e.currentTarget;
        this.reset();
        target.setAttribute('aria-selected', 'true');
        this.handleClass(target, 'add');
        this.props.onResultSelected(this.getData(idx));
      });
    });
  }

  /**
   * 현재 선택된 결과 리스트의 aria-selected를 초기화 한다 .
   *
   * @memberof Result
   * @param {Function} callback 초기화 후에 실행 시킬 callback 함수
   */
  reset() {
    const items = Array.from(document.querySelectorAll('[aria-selected]'));

    items.forEach((item) => {
      item.setAttribute('aria-selected', 'false');
      this.handleClass(item, 'remove');
    });
  }

  /**
   * 결과 리스트 Enter Event
   *
   * @memberof Result
   */
  enterHandler() {
    if (!this.isSelected()) { return; }
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
  nextIndex(index, count) {
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
  prevIndex(index, count) {
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
  keyboardMove(index, type) {
    const items = document.querySelectorAll('[aria-selected]');
    const ul = this.root.querySelector('ul');
    const ulHeight = ul.offsetHeight;
    const liHeight = items[0].offsetHeight;
    const itemCount = items.length - 1;

    if (this.isSelected()) {
      items[index].setAttribute('aria-selected', 'false');
      this.handleClass(items[index], 'remove');
    }

    this.index = this[`${type}Index`](index, itemCount);
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
  keyboardHandler(key, isShift) {
    const targetFn = this.keyHandler[key];
    typeof targetFn === 'function' && targetFn(isShift);
  }

  /**
   * 결과 리스트 중에 선택된 아이템이 있는지에 대한 여부 반환
   *
   * @memberof Result
   * @return {boolean} 활성화 여부
   */
  isSelected() {
    return this.index > -1;
  }

  /**
   * 결과 리스트 선택시 아이템 index 반환
   *
   * @memberof Result
   * @param {number} idx 아이템 index
   * @return {number} 선택된 아이템 index
   */
  getData(idx) {
    const target = this.data[idx];

    return target.value;
  }
}

module.exports = Result;