var cookie = require('../index.js');

var cookieString = 'cookieName=cookie%20value; Expires=Wed, 20 Jan 2016 02:11:09 GMT; Max-Age=500; Path=/; Domain=domain.com; secure';

var cookieObject = cookie.parse(cookieString);

console.log(cookieObject);
// prints:
// { expires: Tue Jan 19 2016 18:11:09 GMT-0800 (Pacific Standard Time),
//   httponly: false,
//   secure: true,
//   path: '/',
//   domain: 'domain.com',
//   name: 'cookieName',
//   value: 'cookie value' }
