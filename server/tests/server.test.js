const assert = require('chai').assert;
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/Todo');

const todoSeedData = [
  { _id: new ObjectID(), text: 'Dummy todo for testing' },
  { _id: new ObjectID(), text: 'Another dummy todo for testing' },
  { _id: new ObjectID(), text: 'Last todo for testing' },
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
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return a specific todo doc', (done) => {
    request(app)
      .get(`/todos/${todoSeedData[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        assert.equal(res.body.todo.text, todoSeedData[0].text);
      })
      .end(done);
  });

  it('Should return a 404 if todo is not found', (done) => {
    request(app)
      .get(`/todos/4bc968fc92a00e7b19dedf00`)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/1234566`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should Delete then return deleted doc', (done) => {
    request(app)
      .delete(`/todos/${todoSeedData[2]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        assert.equal(res.body.todo.text, todoSeedData[2].text);
      })
      .end(done);
  });

  it('Should return a 404 if todo is not found', (done) => {
    request(app)
      .delete(`/todos/4bc968fc92a00e7b19dedf00`)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 for non-object ids', (done) => {
    request(app)
      .delete(`/todos/1234566`)
      .expect(404)
      .end(done);
  });
});
