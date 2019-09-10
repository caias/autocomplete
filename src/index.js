'use strict';

require('./otom.css');

const emailList = ['naver.com', 'hanmail.net', 'nate.com', 'gmail.com', 'lycos.co.kr', 'yahoo.co.kr', 'empal.com', 'dreamwiz.com', 'paran.com', 'korea.com', 'chol.com', 'hanmir.com', 'hanafos.com', 'freechal.com', 'hotmail.com', 'netian.com'];

const defaultOptions = {
  container: '',
  input: '',
  result: '',
  data: '',
  type: '',
};

const inputAttribute = {
  'autocomplete': 'off',
  'aria-expanded': 'false',
  'role': 'combobox',
  'aria-autocomplete': 'both',
};

const anchorAttribute = {
  'href': 'javascript:void(0);',
  'aria-selected': 'false',
};

class Otom {
  constructor(opts = {}) {
    this.props = Object.assign({}, defaultOptions, opts);
    this.container = document.querySelector(this.props.container || '[data-otom-el=container]');
    this.input = this.container.querySelector(this.props.input || '[data-otom-el=input]');
    this.result = document.createElement('div');
    this.index = -1;
    this.isOpened = false;
    this.data = this.props.data || emailList;
  }

  setAttrList(list = {}, target) {
    Object.keys(list).forEach(key => target.setAttribute(key, list[key]));
  }

  removeAttrList(list = {}, target) {
    Object.keys(list).forEach(key => target.removeAttribute(key));
  }

  init() {
    // this.setAttrList(resultWrapAttribute, this.result);
    this.makeContainer(this.data);
    const offBtn = document.querySelector('[data-button=off]');
    const onBtn = document.querySelector('[data-button=on]');
    offBtn.addEventListener('click', () => { this.removeList(); });
    onBtn.addEventListener('click', () => { this.openList(this.data); });
  }

  makeContainer(data) {
    const resultWrapAttribute = {
      'style': `top:${this.input.offsetHeight}px`,
      'data-otom-el': 'result',
    };
    this.setAttrList(resultWrapAttribute, this.result);
    this.result.append(this.updateList(data));
  }

  updateList(data = []) {
    const dataLength = data.length;
    const resultUl = document.createElement('ul');

    for (let i = 0; i < dataLength; i++) {
      const resultList = document.createElement('li');
      const resultAnchor = document.createElement('a');

      this.setAttrList(anchorAttribute, resultAnchor);
      resultAnchor.textContent = data[i];
      resultList.append(resultAnchor);
      resultUl.append(resultList);
    }
    return resultUl;
  }

  getRegex(type) {
    
  }

  openList() {
    this.container.append(this.result);
    this.isOpened = true;
  }
  
  removeList() {
    this.container.removeChild(this.result);
    this.isOpened = true;
  }

  create() {
    this.setAttrList(inputAttribute, this.input);
  }

  destroy() {
    this.props = {};
    this.removeAttrList(inputAttribute, this.input);
  }

}
module.exports = {
  Otom,
};