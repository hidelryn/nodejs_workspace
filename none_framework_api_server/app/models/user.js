
const create = (id, data) => {
  return new Promise((resolve, reject) => {
    if (global.user[id]) return reject(new Error('이미 존재하는 아이디'));
    global.user[id] = data;
    return resolve(global.user[id]);
  });
};

const findByOne = (id) => {
  return new Promise((resolve, reject) => {
    if (!global.user[id]) return reject(new Error('존재하지 않은 회원'));
    return resolve(global.user[id]);
  });
}

const findAll = () => {
  return new Promise((resolve, reject) => {
    return resolve(global.user);
  });
};

module.exports = {
  create,
  findByOne,
  findAll,
};