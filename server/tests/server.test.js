const assert = require('chai').assert;
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/Todo');
const { User } = require('../models/User');
const {
  todoSeedData,
  populateTodos,
  users,
  populateUsers,
} = require('./seed/seed');

// beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', () => {
  it('Should Update the todo', (done) => {
    const text = 'Updated text!';
    request(app)
      .patch(`/todos/${todoSeedData[0]._id.toHexString()}`)
      .send({ completed: true, text})
      .expect(200)
      .expect((res) => {
        assert.equal(res.body.todo.text, text);
        assert.isTrue(res.body.todo.completed);
        assert.isNumber(res.body.todo.completedAt);
      })
      .end(done);
  });

  it('Should set all data appropriately when completed set to false', (done) => {
    request(app)
      .patch(`/todos/${todoSeedData[1]._id.toHexString()}`)
      .send({ completed: false })
      .expect(200)
      .expect((res) => {
        assert.isFalse(res.body.todo.completed);
        assert.isNull(res.body.todo.completedAt);
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  beforeEach(populateUsers);

  it('Should return user if authenticated.', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        const { _id, email } = res.body;
        assert.equal(_id, users[0]._id.toHexString());
        assert.equal(email, users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated.', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        assert.equal(res.body.message, 'jwt must be provided');
      })
      .end(done);
  });
});

describe('POST /users', () => {
  beforeEach(populateUsers);

  it('Should create a user.', (done) => {
    let userData = { email: 'test@example.com', password: 'qweasdzxc' };
    request(app)
      .post('/users')
      .send(userData)
      .expect(201)
      .expect((res) => {
        assert.exists(res.headers['x-auth']);
        assert.equal(res.body.email, userData.email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email: userData.email }).then((user) => {
          assert.exists(user);
          assert.notEqual(user.password, userData.password);
          done();
        }).catch(err => done(err));;
      });
  });

  it('Should return validation errors if request not valid.', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'derp', password: 'something' })
      .expect(400)
      .end(done);
  });

  it('Should not create a user if the email is in use.', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'somedude@test.fake', password: 'derpderp' })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  beforeEach(populateUsers);

  it('Should login a user and return an auth token', (done) => {
    const { email, password } = users[1];
    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        assert.exists(res.headers['x-auth'])
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          assert.equal('auth', user.tokens[0].access);
          assert.equal(res.headers['x-auth'], user.tokens[0].token);
          done();
        }).catch(err => done(err));
      });
  });

  it('Should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({ email: 'derp@herp.com', password: 'nope.Wrong!' })
      .expect(400)
      .expect((res) => {
        assert.notExists(res.headers['x-auth'])
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          assert.equal(0, user.tokens.length);
          done();
        }).catch(err => done(err));
      });
  });
});
