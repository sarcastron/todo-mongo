const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('OH NOEZ! I cannot connect to MongoDB!');
  }
  console.log('Connected to MongoDB, Dude.');

  // db.collection('Todos').find({ _id: ObjectID('5bbdac135ac94969837e2108') }).toArray().then((docs) => {
  //   console.log('Todos', JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Cant', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Cant', err);
  // });

  db.collection('Users').find({ name: 'Adam' }).toArray().then((docs) => {
    console.log('Users', JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Cant', err);
  });

  // db.close();
});
