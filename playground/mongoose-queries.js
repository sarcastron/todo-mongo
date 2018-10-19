const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/Todo');

const id = '5bc834c9d41be60a5df0a62311';

// Todo.find({ _id: id }).then(todos => console.log('Todos', todos));

// Todo.findOne({ _id: id }).then(todo => console.log('Todo', todo));

// if (!ObjectID.isValid(id)) {
//   console.log('ID is not valid');
// }

// Todo.findById(id).then(todo => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo', todo)
// }).catch(err => console.error(err));
