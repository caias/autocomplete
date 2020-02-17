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

const Element = require('@otom/elements');
const { KEYS, EVENTS, isExclude } = require('@otom/event');

/**
 * input attribute 모음
 */
const inputAttrs = {
  'autocomplete': 'off',
  'aria-expanded': 'false',
  'aria-autocomplete': 'list',
  'aria-haspopup': 'listbox',
  'role': 'combobox',
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
const defaultProps = {
  root: '[data-otom-el=container]',
  base: '[data-otom-el=input]',
  onChange: () => {},
  onBlur: () => {},
  onExclude: () => {},
};

/**
 * 변환할 type별 function 모음
 */
const replaceFns = {
  // 이메일
  email: (target, text) => {
    const arr = target.split('@');
    return `${arr[0]}@${text}`;
  },
};

class Input extends Element {
  constructor(opts = {}) {
    const props = Object.assign({}, defaultProps, opts);
    super(props.base, props.root);
    this.props = props;
    /**
     * input 이전값을 확인하기 위한 변수
     * @memberof Input
     * @type {string}
     */
    this.preVal = null;
    /**
     * input이 focus 되어있는지에 대한 여부
     * @memberof Input
     * @type {boolean}
     */
    this.isFocus = false;
  }

  /**
   * initialize
   *
   * @memberof Input
   */
  init() {
    this.attr(inputAttrs);
    this.initHandler();
  }

  /**
   * input event Handler
   *
   * @memberof Input
   */
  initHandler() {
    // focus
    this.base.addEventListener(EVENTS.FOCUS, () => {
      this.isFocus = true;
      this.props.onFocus();
    });

    // blur
    this.base.addEventListener(EVENTS.BLUR, () => {
      this.isFocus = false;
      this.props.onBlur();
    });

    // click event
    this.base.addEventListener(EVENTS.KEY_UP, (e) => {
      const keyCode = e.keyCode;
      const value = e.currentTarget.value;
      const isExcludeKey = isExclude(keyCode);

      // 제외할 key 및 해당 result가 open상태인 경우 callback 실행
      if (isExcludeKey) {
        if (keyCode === KEYS.ESC) {
          this.off();
          return;
        }

        if (this.isOpen()) {
          this.props.onExclude(keyCode);
        }
      }

      // callback내 data를 받아서 처리 (없는 경우 빈 array)      
      const data = this.props.onChange(value) || [];
      if (data.length) {
        this.on();
      } else {
        this.off();
      }
    });
  }

  /**
   * list가 open될시에 aria-expanded 값을 true로 변경한다.
   *
   * @memberof Input
   */
  on() {
    this.attr('aria-expanded', 'true');
  }

  /**
   * list가 close될시에 aria-expanded 값을 false로 변경한다.
   *
   * @memberof Input
   */
  off() {
    this.attr('aria-expanded', 'false');
  }

  /**
   * 현재 list가 열려있는지에 대한 여부를 반환한다.
   *
   * @memberof Input
   * @return {boolean} list 열려있는지에 대한 여부
   */
  isOpen() {
    return JSON.parse(this.base.getAttribute('aria-expanded'));
  }

  /**
   * list상에 선택된 값을 input value값으로 변환한다.
   *
   * @param {string} text 선택된 항목의 텍스트
   * @param {string} type autocomplete type
   * @return {Input} input instance
   */
  replace(text, type) {
    // replace 변수 추출
    const replaceFn = replaceFns[type];
    // replace 함수 없는 경우 기존 text 할당
    this.base.value = typeof replaceFn === 'function' ? replaceFn(this.base.value, text) : text;
    return this;
  }
}

module.exports = Input;
