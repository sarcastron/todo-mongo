require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/Todo');
const { User } = require('./models/User');

const app = express();
const PORT  = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const input = req.body;
  const todo = new Todo({
    text: input.text,
  })

  todo.save().then(
    (doc) => res.status(201).send(doc),
    (err) => res.status(400).send(err)
  );
});

app.get('/todos', (req, res) => {
  Todo.find().then(
    (todos => res.send({ todos })),
    (err) => res.status(400).send(err)
  );
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({ todo });
  })
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      return todo
        ? res.status(200).send({ todo })
        : res.status(404).send();
    }).catch(err => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  const body = _.pick(req.body, ['text', 'completed']);
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = Date.now()
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      return todo
        ? res.status(200).send({ todo })
        : res.status(404).send();
    }).catch(err => res.status(500).send());
});

// POST /users
app.post('/users', (req, res) => {
  const userData = _.pick(req.body, ['email', 'password']);
  const user = new User(userData);

  user.save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).status(201).send(user))
    .catch(err => res.status(400).send(err));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports ={ app };
