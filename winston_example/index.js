
const express = require('express');
const morgan = require("morgan");
const logger = require('./logger');
const app = express();
const PORT = process.env.PORT || 3000;

const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";

app.use(morgan(morganFormat, { stream: logger.httpLogStream }));

app.get('/', (req, res) => {
  res.send('hihi');
});

app.get('/set-item', (req, res) => {
  const { id, name, item_id } = req.query;
  if (typeof id === 'undefined' || typeof name === 'undefined' || typeof item_id === 'undefined') {
    logger.appLogger(3).log({
      level: 'warn',
      message: '파라미터 누락',
    });
    return res.status(200).json({ statusCode: 403, message: '파라미터 누락' });
  }
  if (typeof item_id !== 'string' || !item_id.includes('item_')) {
    logger.appLogger(3).log({
      level: 'error',
      message: '잘못된 아이템 타입',
    });
    return res.status(200).json({ statusCode: 500, message: '잘못된 아이템 타입' });
  }
  logger.appLogger(3).log({
    level: 'info',
    message: `user_id: ${id}, name: ${name}, 획득 아이템: ${item_id}`,
  });
  return res.status(200).json({ statusCode: 200, message: '처리 성공' });
});

app.use((err, req, res, next) => {
  logger.appLogger(4).log({
    level: 'error',
    message: err.stack,
  });
  res.status(500).json({ statusCode: 500, message: err.message });
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));