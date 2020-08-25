
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('./jwt');
const facebook = require('./facebook');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

// login
app.post('/login', (req, res) => {
  const { userId, accessToken } = req.body;
  if (!userId || !accessToken) return res.status(403).send('param check');
  return facebook(userId, accessToken).then((result) => res.status(200).send(result))
    .catch((err) => res.status(500).send(err));
});

// 다른 API
app.post('/api', jwt.verify, (req, res) => {
  if (req.decode) return res.status(200).send(req.decode);
  return res.status(403).send('????!');
});

app.listen(3000, () => {
  console.log('server is running');
});
