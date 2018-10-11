const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('OH NOEZ! I cannot connect to MongoDB!');
  }
  console.log('Connected to MongoDB, Dude.');

  // deteleMany
  // db.collection('Todos').deleteMany({ text: 'Eat something' }).then(result => console.log(result));

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'Eat something' }).then(result => console.log(result));

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({ completed: false }).then(result => console.log(result));

  // db.collection('Users').deleteMany({ name: 'Adam' }).then(result => console.log(result));
  db.collection('Users').findOneAndDelete({ _id: ObjectID('5bbdae30033b4169af5aff56') }).then(result => console.log(result));

  // db.close();
});
