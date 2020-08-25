
const mysql = require('mysql2');
const RedisSMQ = require('rsmq');

const rsmq = new RedisSMQ({ host: '127.0.0.1', port: 6379, ns: 'rsmq' }); // NOTE: ns는 저장할 큐의 네임스페이스

/**
 * TODO: 큐 생성
 * @description 중복된 큐 이름은 생성 불가
 * @param {String} qname 큐 이름
 */
const createQueue = (qname) => {
  return new Promise((resolve, reject) => {
    rsmq.createQueue({ qname }, (err, result) => {
      if (err) return reject(err);
      if (!err && Number(result) === 1) return resolve();
      return reject(new Error('큐 생성 실패'));
    });
  });
};


/**
 * TODO: 메세지 전송
 * @param {String} qname 큐 이름
 * @param {String} message 보낼 메세지
 */
const sendMessage = (qname, message) => {
  return new Promise((resolve, reject) => {
    rsmq.sendMessage({ qname, message }, (err, result) => {
      if (err) return reject(err);
      if (!err && Number(result) === 1) return resolve();
      return reject(new Error('메세지 전송 실패'));
    });
  });
};

/**
 * TODO: 메세지 큐 보내는 프로세스.
 * @param {String} qname 큐 이름
 * @param {String} message 보낼 메세지
 */
const sendProcess = (qname, message) => {
  return new Promise((resolve, reject) => {
    sendMessage(qname, message).then(async () => {
      return resolve();
    }).catch(async (e) => {
      try {
        if (e.name === 'queueNotFound') { // NOTE: queue를 생성 안해서 나는 오류.
          await createQueue(qname);
          await sendMessage(qname, message);
          return resolve();
        }
        return reject(e);
      } catch (err) {
        return reject(err);
      }
    });
  });
};

/**
 * TODO: 메세지 수신하기
 * @param {String} qname 큐 이름
 */
const receiveMessage = (qname) => {
  return new Promise((resolve, reject) => {
    rsmq.receiveMessage({ qname }, (err, result) => {
      if (err && err.name === 'queueNotFound') return resolve(); // NOTE: 아직 등록되지 않은 큐를 읽을 시 예외 처리
      if (err) return reject(err);
      if (!err && result.id) return resolve(result);
      return resolve();
    });
  });
};

/**
 * TODO: sql에 메세지 큐 내용 저장
 * @param {*} data 메세지 내용
 */
const saveLog = (data) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'test',
      waitForConnections: true,
      connectionLimit: 20,
    });
    const sql = 'INSERT INTO `my_log` (`user_id`, `event`, `create_at`) VALUES (?, ?, ?);';
    const values = JSON.parse(data.message);
    connection.execute(sql, [values.user_id, values.event, values.create_at], (err) => {
      connection.end();
      if (err) return reject(err);
      return resolve(data.id);
    });
  });
};

/**
 * TODO: queue 삭제
 * @param {String} qname 큐 이름
 * @param {String} id 큐 ID
 */
const deleteMessage = (qname, id) => {
  return new Promise((resolve, reject) => {
    rsmq.deleteMessage({ qname, id }, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

/**
 * TODO: 메세지 읽은 후 mysql에 저장, 읽은 메세지 삭제.
 * @param {String} qname 큐 이름
 */
const receiveProcess = (qname) => {
  return new Promise((resolve, reject) => {
    receiveMessage(qname).then(async (data) => { // NOTE: queue를 꺼내서 읽음.
      try {
        if (typeof data !== 'undefined') {
          const id = await saveLog(data);
          await deleteMessage(qname, id);
          return resolve(true);
        }
        return resolve(false);
      } catch (err) {
        return reject(err);
      }
    }).catch((e) => {
      return reject(e);
    });
  });
};


exports.sendProcess = sendProcess;
exports.receiveProcess = receiveProcess;
