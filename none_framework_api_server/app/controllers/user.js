
const userModel = require('../models/user');

const createUser = async (req) => {
  try {
    const result = await userModel.create(req.body.id, req.body);
    return result;
  } catch (e) {
    throw e;
  }
};

const getUserByID = async (req) => {
  try {
    return await userModel.findByOne(req.body.id);
  } catch (e) {
    throw e;
  }
};

const getAllUser = async (req) => {
  try {
    return await userModel.findAll();
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createUser,
  getUserByID,
  getAllUser,
};
