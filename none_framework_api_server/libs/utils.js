const url = require("url");

const NONE_CHECK_PARAM_GET_URL = [
  '/userAll'
];

/**
 * GET, POST 파라미터 파싱
 * @param {*} req
 */
const parseParameters = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method === "GET") {
      // GET일 경우 처리
      const qs = url.parse(req.url, true).query;
      if (NONE_CHECK_PARAM_GET_URL.indexOf(req.url) < 0 && Object.keys(qs).length === 0) return reject(new Error('파라미터가 안 넙어 왔습니다'));
      req.body = qs;
      return resolve();
    } // 이외 POST 처리
    const body = [];
    req
      .on("error", (err) => reject(err))
      .on("data", (chuck) => body.push(chuck))
      .on("end", () => {
        try {
          req.body = JSON.parse(Buffer.concat(body).toString());
          resolve();
        } catch(e) {
          if (body.length == 0) e.message = '파라미터가 안 넘어 왔습니다.';
          reject(e);
        }
      });
  });
};

/**
 * 공통) 응답 처리
 * @param {*} err
 * @param {*} body
 * @param {*} res
 */
const responseResult = (err, body, res) => {
  const results = {
    status: 200,
    message: 'SUCCESS',
    body,
  };
  if (err) {
    results.status = 500;
    results.message = err.message;
  } else if (!results.message && typeof results.message === "object") {
    results.status = 403;
    results.message = "페이지를 찾을 수 없습니다.";
  }
  res.writeHead(results.status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(results));
};

exports.parseParameters = parseParameters;
exports.responseResult = responseResult;
