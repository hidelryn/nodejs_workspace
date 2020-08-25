
const async = require('async');

const a = (cb) => {
  setTimeout(() => {
    cb(null, 1);
  }, 4000);
};

const b = (cb) => {
  setTimeout(() => {
    cb(null, 2);
  }, 1000);
};

const c = (cb) => {
  setTimeout(() => {
    cb(null, 3);
  }, 2000);
};

async.series([a, b, c], (err, results) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log('results', results);
  }
});
