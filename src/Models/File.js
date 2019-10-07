const { Schema, model } = require('mongoose');
const fs = require('fs');
const path = require('path');

const file = new Schema(
  {
    path: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

file.virtual('url').get(function() {
  const url = process.env.URL || 'http://localhost:3333';
  return `${url}/files/${encodeURIComponent(this.path)}`;
});

file.pre('remove', function(next) {

  const url = path.resolve(__dirname, '..', '..', 'tmp', this.path);
  fs.unlinkSync(url)
  next();
});

module.exports = model('File', file);
