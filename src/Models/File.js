const { Schema, model } = require('mongoose');
const fs = require('fs');

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
  console.log('pre delete');
  fs.unlinkSync(this.url);
  next();
});

module.exports = model('File', file);
