const { Schema, model } = require('mongoose');

const avatar = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    required: true
  }
});
