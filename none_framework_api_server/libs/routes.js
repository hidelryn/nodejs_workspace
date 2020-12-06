
const user = require('../app/controllers/user');

const router = {
  POST: {
    '/userCreate': user.createUser,
  },
  GET: {
    '/userByID': user.getUserByID,
    '/userAll': user.getAllUser,
  }
};

module.exports = router;