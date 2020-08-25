
const express = require('express');

const request = require('request');

const app = express();

const PORT = process.env.PORT || 3000;

const config = {
  clientId: process.env.INSTAGRAM_CLIENT_ID,
  secret: process.env.INSTAGRAM_CLIENT_SECRET,
  url: process.env.INSTAGRAM_CALLBACK_URL,
};

app.get('/', (req, res) => {
  const INSTAGRAM_AUTH_URL = `https://api.instagram.com/oauth/authorize/?client_id=${config.clientId}&redirect_uri=${config.url}&response_type=code`;
  res.redirect(INSTAGRAM_AUTH_URL);
});

app.get('/instagram/callback', (req, res) => {
  if (req.query.error) {
    // eslint-disable-next-line no-console
    console.log('error: ', req.query.error, 'error_reason', req.query.error_reason);
    return res.redirect('/fail');
  }

  const options = {
    url: 'https://api.instagram.com/oauth/access_token',
    method: 'POST',
    form: {
      client_id: config.clientId, // 인스타에서 받은 클라이언트 아이디
      client_secret: config.secret, // 인스타에서 받은 시크릿, 노출되면 안되는 값임
      grant_type: 'authorization_code', // 이건 고정 값
      redirect_uri: config.url,
      code: req.query.code,
    },
  };

  return request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // eslint-disable-next-line no-console
      console.log('body', JSON.parse(body)); // access_token하고 유저 프로필이 넘어옴.
      return res.redirect('/success');
    }
    return res.redirect('/fail');
  });
});

app.get('/fail', (req, res) => res.send('fail'));

app.get('/success', (req, res) => res.send('success'));

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`express is running on port ${PORT}`));
