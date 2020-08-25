
const express = require('express');
const bodyParser = require('body-parser');
const mt = require('moment-timezone');
const queue = require('./queue');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.send('hi');
});

app.post('/send', (req, res) => {
  const d = mt.tz('Asia/Seoul'); // 서버 시간은 서울로 맞추기.
  let hour = d.hour(); // 0 ~ 23시 type num
  let min = d.minute() + 1; // 0 ~ 59분 type num 큐는 3분뒤에 꺼낼꺼라 더해준다
  if (min > 59) { // 시간 예외 처리용
    min = min === 60 ? 0 : min - 59;
    hour = hour === 23 ? 0 : hour + 1;
  }
  const qname = `${hour}_${min}`;
  const data = {
    user_id: req.body.user_id,
    event: req.body.event,
    create_at: d.format('YYYY-MM-DD HH:mm:ss'),
  };
  queue.sendProcess(qname, JSON.stringify(data)).then(() => {
    return res.json({ result: 'success' });
  }).catch((e) => {
    return res.json(e);
  });
});

app.listen(3000, () => {
  console.log('server listen');
});
