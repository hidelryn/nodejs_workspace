
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const nanoid = require('nanoid');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.js');

const app = express();
const PORT = process.env.PORT || 3000;
const redisClient = redis.createClient();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/getUser', (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res.json({ code: 400, message: 'Missing parameters' });
  }
  redisClient.hget('swaggerUser', userId, (err, data) => {
    if (err) return res.json({ code: 500, message: 'System error' });
    if (!data) return res.json({ code: 403, message: 'None user' });
    const parse = JSON.parse(data);
    return res.json({ code: 200, data: parse });
  });
});

app.post('/createUser', (req, res) => {
  const { name, age } = req.body;
  if (!age || !name) {
    return res.json({ code: 500, message: 'Missing parameters' });
  }
  const id = nanoid();
  const data = {id, name, age};
  redisClient.hset('swaggerUser', id, JSON.stringify(data), (err) => {
    if (err) return res.json({ code: 500, message: 'System error' });
    return res.json({ code: 200, data });
  });
});

app.listen(PORT, () => {
  console.log('server is listening');
});