
const async = require('async');

let x = 100;

const a = (cb) => {
  setTimeout(() => {
    x += 10;
    cb(null, 1);
  }, 4000);
};

const b = (cb) => {
  setTimeout(() => {
    cb(new Error('ㅠㅠ'));
  }, 1000);
};

const c = (cb) => {
  setTimeout(() => {
    cb(null, 3);
  }, 2000);
};

async.series([a, b, c], (err, results) => {
  if (err) {
    console.log('err', err, 'x', x);
  } else {
    console.log('results', results);
  }
});
