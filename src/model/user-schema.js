'use strict';

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('userschema', UserSchema);
