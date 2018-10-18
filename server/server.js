const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/Todo');
const { User } = require('./models/User');

const app = express();
const PORT  = 3000;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports ={ app };
