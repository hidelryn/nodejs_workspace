const AWS = require('aws-sdk');

AWS.config.update({
  region: '', // 리전
  accessKeyId: '', // IAM
  secretAccessKey: '' // IAM
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const randomStr = (len) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const sendMessage = (type, id, body) => {
  const params = {
    QueueUrl: 'SQS에서 발급한 URL',
    MessageBody: JSON.stringify(body), // NOTE: 보낼 메세지
    MessageGroupId: type, // NOTE: 메시지 그룹 ID 특정 메시지 그룹에 속한 메시지를 지정하는 태그. 동일한 메시지 그룹에 속한 메시지는 메시지 그룹에 따라 엄격한 순서로 항상 하나씩 처리됩니다
    MessageDeduplicationId: `${id}:${new Date().getTime()}:${randomStr(5)}`, // NOTE: 메시지 중복 제거 ID 전송된 메시지의 중복 제거에 사용되는 토큰. 특정 메시지 중복 제거 ID가 있는 메시지를 성공적으로 전송한 경우, 메시지 중복 제거 ID가 동일한 모든 메시지는 성공적으로 수신되지만 중복 제거 간격인 5분 동안은 전달되지 않습니다.
  };
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('실패한 메세지', JSON.stringify(params));
        return reject(err);
      }
      console.log('성공한 메세지', JSON.stringify((data)));
      return resolve(data);
    });
  });
};

sendMessage('join', 'a', {id: 'a', ts: new Date().getTime(), message: 'hihi'}).then(() => {
  console.log('a - send success');
}).catch((e) => {
  console.log('e', e);
});

setTimeout(() => {
  sendMessage('join', 'b', {id: 'b', ts: new Date().getTime(), message: 'hello'}).then(() => {
    console.log('b - send success');
  }).catch((e) => {
    console.log('e', e);
  });
}, 2000);

setTimeout(() => {
  sendMessage('join', 'c', {id: 'c', ts: new Date().getTime(), message: '나비보벳따우'}).then(() => {
    console.log('c - send success');
  }).catch((e) => {
    console.log('e', e);
  });
}, 500);