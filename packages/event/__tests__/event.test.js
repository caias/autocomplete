'use strict';

const chai = require('chai');
const { event, getKey } = require('../lib/event');
chai.should();

/* global describe, it */
describe('[@otom/events] test', () => {
  describe('[init test]', () => {
    it('init내에 el이 존재하지 않는경우 error를 반환한다.', () => {

    });
  });

  describe('getKey test', () => {
    it('getKey 호출시 enter값은 13이 되어야 한다.', () => {
      getKey().ENTER.should.equal(13);
    });
  });
});
