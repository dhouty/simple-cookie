var cookie = require('../index.js');

var cookieObject = {
  name: 'cookieName',
  value: 'cookie value',
  expires: (new Date()).valueOf() + 500000,
  path: '/',
  domain: 'domain.com',
  httponly: false,
  secure: true
};

var cookieString = cookie.stringify(cookieObject);

console.log(cookieString);
// prints:
// cookieName=cookie%20value; Expires=Wed, 20 Jan 2016 02:11:09 GMT; Max-Age=500; Path=/; Domain=domain.com; secure
