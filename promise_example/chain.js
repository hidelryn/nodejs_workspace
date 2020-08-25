
const a = (_param) => new Promise((resolve) => {
  resolve(_param);
});

const b = (_param) => new Promise((resolve) => {
  resolve(_param + 10);
});

const c = (_param) => new Promise((resolve) => {
  resolve(_param + 100);
});

a(1).then((A) => b(A).then((B) => c(B).then((result) => {
  console.log('result', result);
})));

a(10).then(async (A) => {
  try {
    const B = await b(A);
    const result = await c(B);
    console.log('result', result);
  } catch (e) {
    console.log('e', e);
  }
});
