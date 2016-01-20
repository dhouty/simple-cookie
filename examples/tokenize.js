var cookie = require('../index.js');

var pairs = [
  { name: 'name1', value: 'value1' },
  { name: 'name2', value: 'value2' },
  { name: 'name3', value: 'value3' }
];

var string = cookie.tokenize(pairs);

console.log(string);
// prints:
// name1=value1; name2=value2; name3=value3
