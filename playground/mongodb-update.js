const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('OH NOEZ! I cannot connect to MongoDB!');
  }
  console.log('Connected to MongoDB, Dude.');

  // db.collection('Todos').findOneAndUpdate(
  //   { _id: ObjectID('5bbeec748ad7e06bed0dd59e') },
  //   { $set: { completed: true } },
  //   { returnOriginal: false }
  // ).then(result => console.log(result));
  db.collection('Users').findOneAndUpdate({
    _id: ObjectID('5bbdac9c70ed3369999e0e57')
  }, {
    $set: { name: 'Adam G Plante' },
    $inc: { age: 1 }
  }, {
    returnOriginal: false
  }).then(res => console.log(res));

  // db.close();
});
