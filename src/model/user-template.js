'use strict';

const uuid = require('uuid/v1');

class UserModel {
  constructor(username, title) {
    this.id = uuid();
    this.timestamp = new Date();
    this.username = username;
    this.title = title;
  }
}

module.exports = UserModel;
