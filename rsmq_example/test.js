const request = require('request');

const event = ['join', 'login', 'purcharse', 'logout'];

const params = [];

const test = () => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      uri: 'http://localhost:3000/send',
      json: {
        user_id: Math.floor(Math.random() * 10000) + 1,
        event: event[Math.floor(Math.random() * 3)],
      },
    }, (err, res, body) => {
      if (err) return reject(err);
      return resolve(body);
    });
  });
};

for (let i = 0; i < 400; i += 1) {
  params.push(test());
}

Promise.all(params).then(() => {
  console.log('end');
}).catch((e) => {
  console.log(e);
});
