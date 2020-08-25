
const router = require('express').Router();
const db = require('../models');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  res.send('hi');
});

// TODO: create
router.post('/create', (req, res) => {
  const { title, quarter } = req.body;
  db.animes.create({
    title,
    quarter,
  }).then((result) => res.json(result)).catch((e) => res.json(e));
});

// TODO: multiple create
router.post('/multiple-create', (req, res) => {
  const { data } = req.body; // NOTE: Array Object [{}, {} ... ]
  db.animes.bulkCreate(data).then((result) => res.json(result)).catch((e) => res.json(e));
});

router.post('/select', (req, res) => {
  const { id } = req.body;
  db.animes.findAll({
    where: {
      id,
      // id: {
      //   [db.Op.gt]: id,
      // },
    },
    // limit: 1, // NOTE: 개수 제한
    // attributes: ['title'], // NOTE: 특정 컬럼만 읽을 때
    // order: ['id', 'desc'], // NOTE: 정렬
  }).then((result) => { // NOTE: 결과는 []에
    if (!result.length) return res.json({ message: 'NOT FOUND' });
    return res.json(result);
  }).catch((e) => res.json(e));
});

// TODO: update
router.post('/update', (req, res) => {
  const { id, title } = req.body;
  db.animes.update(
    {
      title,
    },
    {
      where: {
        id,
      },
    },
  ).then(() => res.json({ message: 'update success' })).catch((e) => res.json(e));
});

// TODO: delete
router.post('/delete', (req, res) => {
  const { id } = req.body;
  db.animes.destroy({
    where: {
      id,
    },
  }).then(() => res.json({ message: 'delete success' })).catch((e) => res.json(e));
});
