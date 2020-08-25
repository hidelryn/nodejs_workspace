// Example model

const mongoose = require('mongoose');

const { Schema } = mongoose;

const uploadsSchema = new Schema({
  title: String,
  uploadImagePath: Array,
  uploadImageName: Array,
  imageOriginalName: Array,
  create_at: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model('uploads', uploadsSchema);
