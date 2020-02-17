/**
 * autocomplete main module
 *
 * @name Otom
 * @author caias
 * @contributors kern86
 * @since 2019.08.05 - draft
 * @example
 * // index.html
 * <div data-otom-el="container">
 *  <input type="email" data-otom-el="input" />
 *  <div data-otom-el="result"></div>
 * </div>
 *
 * //js
 * const Otom = require('Otom');
 * const input = new Otom({
 *  el: '[data-otom-el=input]',
 *  container: '[data-otom-el=container]',
 *  result: '[data-otom-el=result]',
 *  type: 'email',
 * });
 */
'use strict';

const Input = require('../packages/input/lib/input');
const Result = require('../packages/result/lib/result');
const { KEYS, EVENTS, isExclude } = require('../packages/event/lib/event');
const { getMatchted } = require('../packages/validation/lib/validation');
const listTmpl = require('./templates/partials/list.hbs');
const { emailList } = require('./dummy');

/**
 * otom options
 * @memberof Otom
 * @type {Object}
 * @property {string} el target input element string
 * @property {string} container target container element string
 * @property {string} result result container element string
 * @property {string} type autocomplete type
 * @property {Object} xhrOption xhrRequest options
 */
const defaultOptions = {
  el: '[data-otom-el=input]',
  container: '[data-otom-el=container]',
  result: '[data-otom-el=result]',
  type: 'email',
  // xhr option
  xhrOption: {
    url: '',
    data: '',
  },
};

class Otom {
  constructor(opts = {}) {
    this.props = Object.assign({}, defaultOptions, opts);
    const el = this.props.el;

    if (!el) { throw new Error('[Otom] Error: options.el is not defined.'); }
  }

  /**
   * initialize
   * @memberof Otom
   */
  init() {
    this.inputInit();
    this.resultInit();
    // initial event binding
    this.initHandler();
  }

  /**
   * input initialize
   * @memberof Otom
   */
  inputInit() {
    // input initialize
    this.input = new Input({
      root: this.props.container,
      base: this.props.el,
      // onchange function
      onChange: (val) => {
        const matchedData = getMatchted(val, this.props.type, emailList);

        // data convert
        const convertData = matchedData.map((item) => {
          const cuttingWord = item.substring(val.length - (val.indexOf('@') + 1));
          
          return {
            dispVal: `<strong>${val}</strong>${cuttingWord}`,
            value: item,
          };
        });

        this.result.update(convertData);
        // send input data
        return convertData;
      },
      // onfocus function
      onFocus: () => {
        this.result.reset();
        this.result.index = -1;
      },
      // onblur function
      onBlur: () => {
        if (this.input.isOpen()) {
          return;
        }
        this.result.remove();
      },
      // onexclude function
      onExclude: (code) => {
        if (this.input.isOpen()) {
          return;
        }
        this.result.keyboardHandler(code);
      },
    });

    // input 객체 초기화
    this.input.init();
  }

  /**
   * result initialize
   * @memberof Otom
   */
  resultInit() {
    this.result = new Result({
      root: this.props.container,
      container: this.props.result,
      listTmpl,
      activeClass: 'on',
      onResultSelected: (val) => {
        this.input.replace(val, this.props.type).off();
        this.result.remove();
      },
    });

    // result 객체 초기화
    this.result.init();
  }

  /**
   * initial event handler
   * @memberof Otom
   */
  initHandler() {
    // container 추출
    const container = document.querySelector(this.props.container);
    const body = document.querySelector('body');

    // container keydown 이벤트
    // container 전체에 keydown 이벤트를 캐치하여, tab키등의 이벤트에 대응
    container.addEventListener(EVENTS.KEY_DOWN, (e) => {
      // keycode
      const keyCode = e.keyCode;
      // keycode가 제외할 범주에 속해있는지 확인
      const isExcludeKey = isExclude(keyCode);

      if (isExcludeKey) {
        if (this.input.isOpen()) {
          // input내 result가 open 상태인 경우에만 preventDefault 사용
          e.preventDefault();

          const args = [keyCode];
          // input이 focus가 아닌 경우에만 argument에 shiftKey 삽입
          !this.input.isFocus && args.push(e.shiftKey);

          this.result.keyboardHandler.apply(this.result, args);
          // keyCode가 ESC라면 aria-expanded를 false상태로 변경한다.
          args[0] === KEYS.ESC && this.input.off();
          
        }
      }
    });

    // 리스트가 open되있고 컨테이너를 클릭한게 아니라면 리스트를 제거한다.
    body.addEventListener(EVENTS.CLICK, (e) => {
      const target = e.target;
      const isClickContainer = target === container;
      if (!isClickContainer && this.input.isOpen()) {
        this.result.remove();
        this.input.off();
      }
    });

  }

  /**
   * xhr request
   *
   * @memberof Otom
   * @param {Object} opts xhr options
   */
  ajax(opts = {}) {
    if (!opts.url) { throw new Error('[Otom/ajax] Error: url is not defined.'); }

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyStatus === 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          typeof opts.success === 'function' && opts(xhr.responseText);
        } else {
          typeof opts.error === 'function' && opts(xhr.responseText);
        }
      }
    };

    xhr.open(opts.method || 'GET', opts.url, true);
    xhr.send();
  }

}

module.exports = Otom;