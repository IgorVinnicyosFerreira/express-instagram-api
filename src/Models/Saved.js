const { Schema, model } = require('mongoose');

const saved = new Schema({
  folder: {
    type: String,
    required: true
  },
  publications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Publication'
    }
  ]
});

module.exports = model('Saved', saved);
