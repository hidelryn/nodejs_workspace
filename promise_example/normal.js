
const a = (_param) => new Promise((resolve, reject) => {
  if (_param < 10) {
    return reject(new Error('10보다 작다'));
  }
  return resolve('10보다 크다.');
});

a(10).then((result) => {
  console.log('result', result);
}).catch((e) => {
  console.log('err', e);
});
