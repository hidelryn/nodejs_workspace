
const async = require('async');

const arr = [];

// eslint-disable-next-line no-plusplus
for (let i = 0; i < 10; i++) {
  arr.push(i);
}

const a = (_param, cb) => {
  const random = Math.floor(Math.random() * 3) + 1;
  setTimeout(() => {
    cb(_param);
  }, random);
};

const results = [];

async.each(arr, (item, callback) => {
  a(item, (data) => {
    results.push(data);
    callback();
  });
}, (err) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log('results', results);
  }
});
