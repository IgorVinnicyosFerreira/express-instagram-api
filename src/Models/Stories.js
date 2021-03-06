const { Schema, model } = require('mongoose');

const storie = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    filed: {
      type: Boolean,
      default: false
    },
    media: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model('Storie', storie);
