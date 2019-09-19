'use strict';

require('./otom.css');

const { emailList } = require('./dummy');

const defaultOptions = {
  container: '',
  input: '',
  data: '',
  type: 'email',
};

const inputAttrs = {
  'autocomplete': 'off',
  'aria-expanded': 'false',
  'aria-autocomplete': 'list',
  'aria-haspopup': 'listbox',
  'role': 'combobox',
};

const resultAttrs = {
  'data-otom-el': 'result',
  'aria-atomic': 'true',
  'aria-live': 'assertive',
  'role': 'listbox',
};

class Otom {
  constructor(opts = {}) {
    this.props = Object.assign({}, defaultOptions, opts);
    this.container = document.querySelector(this.props.container || '[data-otom-el=container]');
    this.input = this.container.querySelector(this.props.input || '[data-otom-el=input]');
    this.result = this.container.querySelector(this.props.result || '[data-otom-el=result]');
    this.type = this.props.type || 'default';
    this.data = this.props.data || emailList;
    this.index = -1;
  }

  setAttrList(list = {}, target) {
    Object.keys(list).forEach(key => target.setAttribute(key, list[key]));
  }

  makeContainer() {
    const div = document.createElement('div');
    Object.keys(resultAttrs).forEach(key => div.setAttribute(key, resultAttrs[key]));
    div.innerHTML = this.makeList(this.data).outerHTML;
    this.container.append(div);
  }

  makeList(data = []) {
    const dataLength = data.length;
    const resultUl = document.createElement('ul');

    for (let i = 0; i < dataLength; i++) {
      const anchorAttribute = {
        'href': 'javascript:void(0);',
        'aria-selected': 'false',
        'data-otom-el': 'item',
      };
      const resultList = document.createElement('li');
      const resultAnchor = document.createElement('a');

      this.setAttrList(anchorAttribute, resultAnchor);
      resultAnchor.textContent = data[i];
      resultList.append(resultAnchor);
      resultUl.append(resultList);
    }
    return resultUl;
  }

  updateList(data = []) {
    if (!this.isOpen()) { return; }
    this.data = data;

    const result = document.querySelector('[data-otom-el=result]');

    if (data.length) {
      result.innerHTML = this.makeList(data).outerHTML;
      this.itemClick();
    } else {
      this.close();
    }
  }

  open() {
    this.input.setAttribute('aria-expanded', 'true');
    this.makeContainer();
  }

  close() {
    if (!this.isOpen()) { return; }

    const result = document.querySelector('[data-otom-el=result]');

    this.container.removeChild(result);
    this.input.setAttribute('aria-expanded', 'false');
    this.index = -1;
  }

  isSelected() {
    return this.index > -1;
  }

  isOpen() {
    return this.input.getAttribute('aria-expanded') === 'true';
  }

  getRegex() {
    const val = this.input.value;
    if (this.type === 'email') {
      const charCheck = val.indexOf('@') + 1;
      const regex = val.slice(charCheck);
      return new RegExp(`${regex}`);
    } else if (val === '') {
      return new RegExp('$^');
    }
    return new RegExp(val);
  }

  getMatchData(data = []) {
    const regex = this.getRegex();
    return data.filter(value => regex.test(value));
  }

  getEmailValid() {
    const val = this.input.value;
    return val.indexOf('@') > 0; 
  }

  onChange(e) {
    const key = e.keyCode;
    const matchData = this.getMatchData(emailList);

    if (this.type === 'email' && !this.isOpen()) {
      this.getEmailValid() && this.open();
    } else if (!this.isOpen()) {
      this.open();
    }
    this.updateList(matchData);
    this.keyboardHandler(key);
    console.log(this.index);
  }

  getDataText(index) {
    return this.data[index];
  }

  replaceValue(selectedText) {
    if (this.type === 'email') {
      const inputvalue = this.input.value.split('@');
      return this.input.value = `${inputvalue[0]}@${selectedText}`;
    }
    return this.input.value = selectedText;
  }

  itemEnter() {
    if (!this.isSelected()) {
      return;
    }
    this.replaceValue(this.getDataText(this.index));
    this.close();
  }

  itemClick() {
    const items = this.container.querySelectorAll('[data-otom-el=item');

    items.forEach((anchor, index) => {
      anchor.addEventListener('click', (e) => {
        const target = e.currentTarget;
        items.forEach((item) => {
          item.setAttribute('aria-selected', 'false');
        });
        target.setAttribute('aria-selected', 'true');
        this.replaceValue(this.getDataText(index));
        this.close();
      });
    });
  }

  nextIndex(index, length) {
    return index < length ? this.index + 1 : 0;
  }

  prevIndex(index, length) {
    this.index = index === -1 ? index : index - 1;
    return this.index === -1 ? length : this.index;
  }

  keyboardMove(index, type) {
    const items = this.container.querySelectorAll('[aria-selected]');
    const itemLength = items.length - 1;
    const liHeight = items[0].offsetHeight;
    const ul = this.container.querySelector('ul');
    const ulHeight = ul.offsetHeight;

    if (this.isSelected()) {
      items[index].setAttribute('aria-selected', 'false');
    }

    this.index = this[`${type}Index`](index, itemLength);
    items[this.index].setAttribute('aria-selected', 'true');    
    ul.scrollTop = items[this.index].offsetTop - ulHeight + liHeight;
  }

  keyboardHandler(key) {    
    if (!this.isOpen()) { return; }
    
    if (key === 38) {
      // up
      this.keyboardMove(this.index, 'prev');
      // down
    } else if (key === 40) {
      this.keyboardMove(this.index, 'next');
      // enter
    } else if (key === 13) {
      this.itemEnter();
      // esc
    } else if (key === 27) {
      this.isOpen() && this.close();
    }
  }

  create() {
    this.setAttrList(inputAttrs, this.input);
  }

  destroy() {
    this.props = {};
    Object.keys(inputAttrs).forEach(key => this.input.removeAttribute(key));
  }

  init() {
    this.setAttrList(inputAttrs, this.input);
    this.input.addEventListener('keyup', (e) => { this.onChange(e); });
    this.input.addEventListener('blur', () => { this.close(); });
  }

}
module.exports = {
  Otom,
};