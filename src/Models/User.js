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
  bio: String,
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  followings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
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
