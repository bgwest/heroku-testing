'use strict';

const faker = require('faker');
const Note = require('../../model/user-schema');

const noteMock = module.exports = {};

// development note: p'Var' is a naming convention to know that the function will return promise
noteMock.pCreateNoteMock = () => {
  return new Note({
    username: faker.lorem.words(5),
    title: faker.lorem.words(6),
  }).save(); // development note: calling/using MONGO
};

noteMock.pCleanNoteMocks = () => {
  // development note: this line here ensures that the DB is wiped when we call it again
  return Note.remove({});
};
