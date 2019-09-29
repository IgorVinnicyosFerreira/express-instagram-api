const { Schema, model } = require('mongoose');

const publication = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: String,
    location: String,
    media: [
      {
        type: String,
        required: true
      }
    ],
    filed: {
      type: Boolean,
      default: false
    },
    noComments: {
      type: Boolean,
      default: false
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model('Publication', publication);
