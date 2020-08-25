
const router = require('express').Router();
const db = require('../models');

module.exports = (app) => {
  app.use('/join', router);
};

router.get('/', (req, res) => {
  res.send('hi');
});

// TODO: create team
router.post('/team', (req, res) => {
  const { title, place } = req.body;
  db.teams.create({
    title,
    place,
  }).then((result) => res.json(result)).catch((e) => res.json(e));
});

// TODO: create player
router.post('/player', (req, res) => {
  const { name, position, teamId } = req.body;
  db.players.create({
    name,
    position,
    teamId,
  }).then((result) => res.json(result)).catch((e) => res.json(e));
});

// TODO: join 플레이어(N) : 팀(1)
router.get('/join1', (req, res) => {
  db.players.findAll({
    include: { model: db.teams },
  }).then((result) => {
    if (!result.length) return res.json({ message: 'NOT FOUND' });
    return res.json(result);
  }).catch((e) => res.json(e));
});

// TODO: join 팀(1): 플레이어 (N)
router.get('/join2', (req, res) => {
  db.teams.findAll({
    include: { model: db.players },
  }).then((result) => {
    if (!result.length) return res.json({ message: 'NOT FOUND' });
    return res.json(result);
  }).catch((e) => res.json(e));
});

// TODO: 트랜잭션
router.post('/transaction', (req, res) => {
  const { name, position, teamId } = req.body;
  db.sequelize.transaction().then(async (t) => { // NOTE: 트랜잭션 시작
    try {
      const player = await db.players.create({ // NOTE: 선수 등록
        name,
        position,
        teamId,
      }, { transaction: t });
      await db.teams.findOne({ // NOTE: 해당 팀이 잇는지 체크
        where: {
          id: player.teamId,
        },
      }, { transaction: t }); // NOTE: 트랜잭션
      t.commit(); // NOTE: 팀이 잇으먼 commit (=저장)
      return res.json({ message: 'create success' });
    } catch (err) {
      t.rollback(); // NOTE: 에러 (업는 팀)인 경우 롤백 (저장 취소)
      return res.json(err);
    }
  }).catch((e) => res.json(e));
});

// TODO: sql 쿼리
router.get('/query', (req, res) => {
  db.sequelize.query('select * from players').then((result) => {
    console.log(result); // NOTE: 똑같은 결과가 2개 나오므로 [0]으로 처리.
    return res.json(result[0]);
  }).catch((e) => res.json(e));
});
