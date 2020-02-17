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

class Element {
  constructor(el, root) {

    this.root = document.querySelector(root);
    this.base = this.find(this.root, el)[0];
  }

  /**
   * element를 update한다.
   * @param {string|Element} [el] base로 바인딩하고자 하는 element
   */
  updateEl(el) {
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
  attr(...args) {
    this.updateProps.apply(this, [...args, 'attr']);
  }

  /**
   * attribute를 삭제한다.
   * @param {Array} args argument list
   * @example
   *  this.removeAttr('aria-expanded');
   */
  removeAttr(...args) {
    this.updateProps.apply(this, [...args, 'removeAttr']);
  }

  /**
   * css를 변경한다.
   * @param  {Array} args argument list
   * @example
   *  this.css('top', '30px');
   */
  css(...args) {
    this.updateProps.apply(this, [...args, 'css']);
  }

  /**
   * argumentlist에 따라서 property를 변경한다.
   * @param  {Array} args property를 변경할 argument list
   * @return {Element} element instance
   */
  updateProps(...args) {
    let type;
    // argument length에 따른 분기
    switch (args.length) {
      // 2개 - ([{key: value}]), type
      case 2:
        const list = args[0];
        type = args[1];
        this.getFn(type, true).call(this, list);
        break;
      // 3개 - key, value, type
      case 3:
        const key = args[0];
        const value = args[1];
        type = args[2];
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
  getFn(type, isList = false) {
    switch (type) {
      case 'css':
        const cssFn = isList ? this.setStyleList : this.setStyle;
        return cssFn;
        break;
      case 'attr':
        const attrFn = isList ? this.setAttrList : this.setAttr;
        return attrFn;
        break;
      case 'removeAttr':
        const removeFn = isList ? this.removeAttrList : this.removeAttr;
        return removeFn;
        break;
      default:
        return () => {};
        break;
    }
  }

  /**
   * object의 key, value값을 attribute로 업데이트한다.
   * @param {Object} list update할 list object
   */
  setAttrList(list = {}) {
    Object.keys(list).forEach(key => this.setAttr(key, list[key]));
  }

  /**
   * 단일 key, value의 attribute를 업데이트 한다.
   * @param {string} key 업데이트할 attribute key
   * @param {*} value 업데이트할 value
   */
  setAttr(key, value) {
    this.base.setAttribute(key, value);
  }

  /**
   * object의 key, value값을 style로 업데이트한다.
   * @param {Object} list update할 list object
   */
  setStyleList(list = {}) {
    Object.keys(list).forEach(key => this.setStyle(key, list[key]));
  }

  /**
   * 단일 key, value의 style를 업데이트 한다.
   * @param {string} key 업데이트할 attribute key
   * @param {*} value 업데이트할 value
   */
  setStyle(key, value) {
    this.base.style[key] = value;
  }

  /**
   * object의 key, value값을 attribute 모음을 제거한다.
   * @param {Object} list update할 list object
   */
  removeAttrList(list = []) {
    list.forEach(key => this.removeAttr(key));
  }

  /**
   * object의 key, value값을 attribute를 제거한다.
   * @param {Object} key 제거할 key
   */
  removeAttr(key) {
    this.base.removeAttribute(key);
  }

  /**
   * target에 대한 selector를 찾는다.
   * @param {Element} target 부모 element
   * @param {string} selector target 에서 찾고자 하는 selector
   * @return {Element} select된 element
   */
  find(target, selector) {
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
  append(target, htmlStr, callback) {
    const { count, children } = this.convertDom(htmlStr);
    // count를 loop돌며 append child 실행
    for (let idx = 0; idx < count; idx++) {
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
  convertDom(htmlStr) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlStr;

    return {
      count: wrapper.childElementCount,
      children: wrapper.children,
    };
  }
}

module.exports = Element;

