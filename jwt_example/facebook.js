
const axios = require('axios');
const redis = require('redis');
const jwt = require('./jwt');

const redisClient = redis.createClient();
const FACEBOOK_URL = 'https://graph.facebook.com/v3.2/';
const { FACEBOOK_APP_TOKEN } = process.env;

/**
 * TODO: 엑세스 토큰 검증 체크
 * @param {*} userId 페이스북에서 발급한 유저 ID
 * @param {*} accessToken 페이스북에서 발급한 엑세스 토큰
 */
const accessTokenVerify = (userId, accessToken) => new Promise((resolve, reject) => {
  const requestURL = `${FACEBOOK_URL}debug_token?input_token=${accessToken}&access_token=${FACEBOOK_APP_TOKEN}`;
  axios.get(requestURL).then((response) => {
    const body = response.data;
    if (body.data.is_valid && body.data.user_id === userId) return resolve();
    return reject(new Error('facebook verify fail'));
  }).catch((err) => reject(err));
});

/**
 * TODO: 페이스북 유저 프로필 가지고 오기.
 * @param {*} accessToken 페이스북에서 발급한 엑세스 토큰
 */
const getFaceebookProfile = (accessToken) => new Promise((resolve, reject) => {
  const requestUrl = `${FACEBOOK_URL}me?fields=id,name,picture&access_token=${accessToken}`;
  axios.get(requestUrl).then((response) => resolve(response.data)).catch((err) => reject(err));
});

/**
 * TODO: redis에 유저 데이터 저장
 * @param {*} userId 페이스북에서 발급한 유저 ID
 * @param {*} userData 유저 페이스북 프로필
 */
const setUser = (userId, userData) => new Promise((resolve, reject) => {
  redisClient.hset('profile', userId, JSON.stringify(userData), (err) => {
    if (err) return reject(err);
    return resolve();
  });
});

/**
 * TODO: redis에 저장된 유저 프로필 가지고 오기.
 * @param {*} userId 페이스북에서 발급한 유저 ID
 */
const getUser = (userId) => new Promise((resolve, reject) => {
  redisClient.hget('profile', userId, (err, data) => {
    if (err) return reject(err);
    if (!data) return resolve();
    return resolve(JSON.parse(data));
  });
});

/**
 * TODO: 로그인 처리 후 JWT 토큰 발급
 * @param {*} userId 페이스북에서 발급한 유저 ID
 * @param {*} accessToken 페이스북에서 발급한 엑세스 토큰
 */
const login = (userId, accessToken) => new Promise((resolve, reject) => {
  accessTokenVerify(userId, accessToken).then(async () => {
    try {
      const userData = await getUser(userId);
      if (typeof userData !== 'undefined') {
        userData.token = jwt.makeToken(userId);
        return resolve(userData);
      }
      const facebookProfile = await getFaceebookProfile(accessToken);
      await setUser(userId, facebookProfile);
      facebookProfile.token = jwt.makeToken(userId);
      return resolve(facebookProfile);
    } catch (err) {
      return reject(err);
    }
  }).catch((err) => reject(err));
});

module.exports = login;
