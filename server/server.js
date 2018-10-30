require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/Todo');
const { User } = require('./models/User');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const PORT  = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const input = req.body;
  const todo = new Todo({
    text: input.text,
    _creator: req.user._id,
  })

  todo.save().then(
    (doc) => res.status(201).send(doc),
    (err) => res.status(400).send(err)
  );
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then(
    (todos => res.send({ todos })),
    (err) => res.status(400).send(err)
  );
});

app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({ _id: id, _creator: req.user._id }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({ todo });
  })
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
    .then((todo) => {
      return todo
        ? res.status(200).send({ todo })
        : res.status(404).send();
    }).catch(err => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true })
    .then((todo) => {
      return todo
        ? res.status(200).send({ todo })
        : res.status(404).send();
    }).catch(err => res.status(500).send());
});

app.post('/users', (req, res) => {
  const userData = _.pick(req.body, ['email', 'password']);
  const user = new User(userData);

  user.save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).status(201).send(user))
    .catch(err => res.status(400).send());
});

app.get('/users/me', authenticate, (req, res) => {
  return res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const { email, password } = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(email, password).then((user) => {
    user.generateAuthToken().then(token => res.header('x-auth', token).send(user));
  }).catch(err => res.status(400).send(err));
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => { res.status(400).send() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports ={ app };
