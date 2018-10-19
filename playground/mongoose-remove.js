const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/Todo');

// Todo.remove({}).then(result => console.log(result));

// Todo.findOneAndRemove({}).then(result => console.log(result));

Todo.findByIdAndRemove('5bc9810063876e8e541ecc27').then((todo) => {
  console.log(todo);
});
