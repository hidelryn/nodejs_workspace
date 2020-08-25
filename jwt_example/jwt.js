
const jwt = require('jsonwebtoken');

const secret = 'nyancat (=^･ｪ･^=))ﾉ彡☆';

/**
 * TODO: jwt 토큰 생성
 * @description 사용 알고리즘은 hmac sha256이라고 함
 * @param {*} id 넣고싶은 해시 값, 지금은 걍 아디로.
 */
const makeToken = (id) => {
  const payload = { id };
  const options = {
    issuer: 'delryn', // 발행자
    expiresIn: '12h', // 날짜는 @d 시간은 @h, 분은 @m 그냥 숫자만 넣으면 ms단위
  };
  return jwt.sign(payload, secret, options);
};

/**
 * 검증 미들웨어
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verify = (req, res, next) => {
  const checksum = new Promise((resolve, reject) => {
    jwt.verify(req.body.token, secret, (err, decode) => {
      if (err) return reject(err);
      return resolve(decode);
    });
  });

  return checksum.then((result) => {
    req.decode = result;
    return next();
  }).catch((err) => {
    console.log(err.message);
    return res.status(401).send('jwt verify fail');
  });
};

exports.makeToken = makeToken;
exports.verify = verify;
