
const async = require('async');

const a = (cb) => {
  setTimeout(() => {
    cb(null, 1);
  }, 4000);
};

const b = (data, cb) => {
  setTimeout(() => {
    cb(null, data + 2);
  }, 1000);
};

const c = (data, cb) => {
  setTimeout(() => {
    cb(null, data + 3);
  }, 2000);
};

async.waterfall([a, b, c], (err, result) => {
  if (err) {
    console.log('err', err);
  } else {
    console.log('result', result);
  }
});
