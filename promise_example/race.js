
const a = () => new Promise((resolve) => {
  const random = Math.floor(Math.random() * 3) + 1;
  setTimeout(() => {
    console.log('a', 10);
    resolve(10);
  }, random);
});

const b = () => new Promise((resolve) => {
  const random = Math.floor(Math.random() * 3) + 1;
  setTimeout(() => {
    console.log('b', 100);
    resolve(100);
  }, random);
});

Promise.race([a(), b()]).then((result) => {
  console.log('result - 1', result);
});

const x = async () => {
  try {
    const result = await Promise.race([a(), b()]);
    console.log('result - 2', result);
  } catch (e) {
    console.log('e', e);
  }
};

x();
