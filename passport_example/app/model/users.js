
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  image: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model('users', UserSchema);
