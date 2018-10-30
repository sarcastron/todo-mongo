const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('../../models/Todo');
const { User } = require('../../models/User');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: 'somedude@test.fake',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }],
  },
  {
    _id: userTwoId,
    email: 'another.dude@test.fake',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
    }],
  },
];

const todoSeedData = [
  { _id: new ObjectID(), text: 'Dummy todo for testing', _creator: userOneId },
  {
    _id: new ObjectID(),
    text: 'Another dummy todo for testing',
    completed: true,
    completedAt: 1539934961156,
    _creator: userTwoId,
  },
  { _id: new ObjectID(), text: 'Last todo for testing', _creator: userOneId },
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todoSeedData);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = { todoSeedData, populateTodos, users, populateUsers };
