const assert = require('chai').assert;
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/Todo');

const todoSeedData = [
  { text: 'Dummy todo for testing' },
  { text: 'Another dummy todo for testing' },
  { text: 'Last todo for testing' },
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todoSeedData);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new Todo', (done) => {
    const text = 'Some test text.';
    request(app)
      .post('/todos')
      .send({ text })
      .expect(201)
      .expect((res) => {
        assert.equal(res.body.text, text);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((todos) => {
          assert.equal(todos.length, 1);
          assert.equal(todos[0].text, text);
          done();
        }).catch(err => done(err));
      });
  });

  it('Should not create a new Todo if the text field is empty', (done) => {
    const text = 'Some test text.';
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          assert.equal(todos.length, 3);
          done();
        }).catch(err => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all Todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        assert.equal(res.body.todos.length, 3);
      })
      .end(done());
  });
});
