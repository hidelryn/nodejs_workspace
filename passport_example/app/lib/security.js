
const crypto = require('crypto');

const csrf = require('csurf');

const MY_SALT = 'Always back up Hexo articles. :(';


// TODO: 단방향 암호화.
module.exports.changeHash = (_val) => crypto.createHash('sha512').update(_val + MY_SALT).digest('base64');

// TODO: 파라미터(길이) 만큼 랜덤 해시 생성.
module.exports.randomHash = (_len) => crypto.randomBytes(Math.ceil(_len / 2)).toString('hex').slice(0, _len);

// TODO: 간단한 xss 필터.
module.exports.xssFilter = (_val) => _val.replace(/</g, '&lt;').replace(/>/g, '&gt;');

// TODO: csrf 검증.
module.exports.csrfProtection = () => csrf({ cookie: true });

// TODO: 로그인 세션 체크.
module.exports.isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
};
