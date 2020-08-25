const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('nanoid');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const port = 3000;

app.post('/join', (req, res) => {
  return res.json({ code: 200, id: uuid(), create_at: new Date().getTime() });
});

app.get('/data', (req, res) => {
  const { id } = req.query;
  console.log('id', id);
  if (!id) {
    return res.status(500).json({ code: 500, message: 'something wrong' });
  }
  return res.json({ code: 200, id });
});

app.listen(port, (req, res) => {
  console.log(`running on port ${port}`);
});