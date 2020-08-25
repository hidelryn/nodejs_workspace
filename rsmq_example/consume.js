
const { CronJob } = require('cron');
const mt = require('moment-timezone');
const queue = require('./queue');

const job = new CronJob('* * * * *', () => { // NOTE: 1분마다 확인.
  const d = mt.tz('Asia/Seoul');
  const hour = d.hour();
  const min = d.minute();
  const qname = `${hour}_${min}`;
  const loop = async () => { // NOTE: 큐에 등록된 메세지들을 전부 다 읽기 위해 재귀로 처리를 한다.
    try {
      const result = await queue.receiveProcess(qname);
      console.log('qname', qname, 'result', result);
      if (result) return loop();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  loop();
}, null, true, 'Asia/Seoul');
job.start();
