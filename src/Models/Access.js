const { Schema, model } = require('mongoose');

const access = new Schema({
  password: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Access', access);
