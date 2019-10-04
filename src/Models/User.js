const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },
  genre: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  birthday: {
    type: Date,
    required: true
  },
  description: String,
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  publications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Publication'
    }
  ],
  stories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Storie'
    }
  ]
});

module.exports = model('User', userSchema);
