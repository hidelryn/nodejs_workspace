
const a = () => new Promise((resolve) => {
  resolve(10);
});

const b = () => new Promise((resolve) => {
  resolve(100);
});

const c = () => new Promise((resolve) => {
  resolve(1000);
});

Promise.all([a(), b(), c()]).then((results) => {
  console.log('results - 1', results);
});

const x = async () => {
  try {
    const results = await Promise.all([a(), b(), c()]);
    console.log('results - 2', results);
  } catch (error) {
    console.log('err', error);
  }
};

x();
