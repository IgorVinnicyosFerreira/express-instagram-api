const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  avatar: String,
  nickName: {
    type: String,
    required: true
  },
  birthDay: {
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
