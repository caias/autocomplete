'use strict';

const puppeteer = require('puppeteer');
const { expect, should } = require('chai');
const _ = require('lodash');
should();

const globalVariables = _.pick(global, ['browser', 'expect']);
const opts = {
  headless: false,
  slowMo: 100,
  timeout: 0,
  args: ['--start-maximized', '--window-size=1920, 1040'],
};

/* global describe, it */
describe('otom e2e test', async () => {
  let page;
  let browser;

  before(async () => {
    browser = await puppeteer.launch(opts);
    page = await browser.newPage();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:5000');
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });

  it('go to page', async () => {
    // await page.focus('input');
    // await page.keyboard.type('test');
    // await page.evaluate(() => {
    //   console.log(document.querySelector('input').value);
    //   // document.querySelector('input').value.should.equal('test');
    // });
    const $input = await page.$('input');
    await $input.click({ clickCount: 1 });
    await $input.type('test@');
    await page.waitForSelector('[data-otom-el=list]');
    const $resultList = await page.evaluate(function () {
      document.querySelector('[data-otom-el=list]');
      expect($resultList).to.not.exist();
    });
//     console.log(resultList);
//     await expect(page.$('[data-otom-el=list]')).to.not.exist;
    // console.log($input.value.toString());
    // ($input.value).should.equal('test');
  });
});
