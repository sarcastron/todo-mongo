const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 10
};

var token = jwt.sign(data, 'abc123');
console.log(token);

const decoded = jwt.verify(token+'1', 'abc123');
console.log('decoded: ', decoded);

// var message = "I am user number 3";
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);

// const data = {
//   id: 4
// };
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString(),
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data) + 'I.dont.know.the.salt').toString();

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (token.hash === resultHash) {
//   console.log('Looks good.');
// } else {
//   console.log('Data was changed. DO NOT TRUST!');
// }
