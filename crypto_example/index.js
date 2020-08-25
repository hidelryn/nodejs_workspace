
const crypto = require('crypto');

const key = 'delryn';

/**
 * TODO: sha512 해싱 알고리즘
 * @description 단방향
 * @param {String} text 암호화할 평문.
 */
const sha512 = (text) => crypto.createHash('sha512').update(key + text).digest('base64');

/**
 * TODO: hmac 해싱 알고리즘
 * @description 단방향
 * @param {String} text 암호화할 평문
 */
const hmac = (text) => crypto.createHmac('sha256', key).update(text).digest('hex');

// TODO: aes256 key 만들기 16byte
const makeAes256Key = crypto.randomBytes(16).toString('hex');

// TODO: aes256 iv 만들기 8byte
const makeIv = crypto.randomBytes(8).toString('hex');

/**
 * TODO: AES 256 암호화
 * @description 양방향
 * @param {*} aesKey aes256 key
 * @param {*} aesIv aes256 IV
 * @param {*} text 암호화할 평문
 */
const aes256Encrypt = (aesKey, aesIv, text) => {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
    let result = cipher.update(text, 'utf8', 'base64');
    result += cipher.final('base64');
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * TODO: AES 256 복호화
 * @description 양방향
 * @param {*} aesKey aes256 key
 * @param {*} aesIv aes256 IV
 * @param {*} cryptogram 암호문
 */
const aes256Decrypt = (aesKey, aesIv, cryptogram) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, aesIv);
    let result = decipher.update(cryptogram, 'base64', 'utf8');
    result += decipher.final('utf8');
    return result;
  } catch (error) {
    return error;
  }
};

console.log('sha512 암호화: ', sha512('안녕'));
console.log('hmac 암호화: ', hmac('하이하이'));
const x = aes256Encrypt(makeAes256Key, makeIv, '이게 뭘까요?');
console.log('aes256 암호화: ', x);
const y = aes256Decrypt(makeAes256Key, makeIv, x);
console.log('aes256 복호화: ', y);
