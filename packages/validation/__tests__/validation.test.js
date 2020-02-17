'use strict';

const chai = require('chai');
const { getMatchted, isValid } = require('../lib/validation');

const should = chai.should();

describe('@otom/validation', () => {
  describe('[validation/isValid] test', () => {
		it('type이 email이고, email 형식이 아닌 경우, false를 반환한다.', () => {
			isValid('test', 'email').should.equal(false);
		});

		it('type이 email이고, email형식인 경우, true를 반환한다.', () => {
			isValid('test@test.com', 'email').should.equal(true);
		});

		it('type이 존재하지 않는 경우, false를 반환한다.', () => {
			isValid('test', 'test').should.equal(false);
		});
	});
});
