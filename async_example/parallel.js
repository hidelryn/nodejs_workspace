
const async = require('async');

const a = (cb) => {
  setTimeout(() => {
    cb(null, 1);
  }, 2000);
};

const b = (cb) => {
  setTimeout(() => {
    cb(null, 2);
  }, 3000);
};

async.parallel([a, b], (err, results) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log('results', results);
  }
});
