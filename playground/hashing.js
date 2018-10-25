const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'abc123';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log('done: ', hash);
  });
});

const hashedPassword = '$2a$10$3ecv45hPzzOjjkvyCb9e2OJeTI3y1oAVcqdjwraK6dmnlaWW0g8J2';

bcrypt.compare(password, hashedPassword, (err, res) => console.log(res));

// const data = {
//   id: 10
// };

// var token = jwt.sign(data, 'abc123');
// console.log(token);

// const decoded = jwt.verify(token+'1', 'abc123');
// console.log('decoded: ', decoded);
