
const assert = require('assert');
const User = require('../user');

describe('User', () => { // NOTE: description
  it('#init', () => {
    const user = new User('abc');
    assert.equal(user.getLoginDate, '2020-03-21', '날짜가 다르네?');
  });
  it('#setLoginCount', (done) => {
    const user = new User('qwe');
    const rnd = Math.floor(Math.random() * 100) + 1;
    user.setLoginCount = rnd;
    if (user.getLoginCount >= 1 && user.getLoginCount <= 50) return done(new Error('범위보다 크다.'));
    return done();
  });
});

