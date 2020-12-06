const http = require("http");

const utils = require('./libs/utils');
const router = require('./libs/routes');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const opt = {
    err: null,
    body: null,
    res,
  };
  try {
    await utils.parseParameters(req);
  } catch (e) {
    return utils.responseResult(e, opt.body, opt.res);
  }
  let url = req.url;
  if (req.method === 'GET') url = req.url.split('?')[0];
  try {
    opt.body = await router[req.method][url].call(null, req);
  } catch (e) {
    if (router[req.method][url]) opt.err = e;
  }
  utils.responseResult(opt.err, opt.body, opt.res);
});

server.listen(PORT, () => {
  global.user = {};
  console.log(`서버는 ${PORT}에서 동작중..`)
});
