/**
 * @typedef CookieObject
 * @type Object
 * @property {String} name - The cookie's name
 * @property {String} value - The cookie's value
 * @property {(DateString|Number|Date)} [expires] - The cookie's expiration date
 * @property {String} [path=/] - The cookie's path
 * @property {String} [domain] - The cookie's domain
 * @property {Boolean} [httponly=false] - The cookie's HttpOnly flag
 * @property {Boolean} [secure=false] - The cookie's Secure flag
 */

function printExpires(expires) {
    if (!expires) return false;
    if (typeof expires == 'string') expires = new Date(expires);
    if (typeof expires == 'number') expires = new Date(expires);
    var n = (expires.valueOf() - (new Date()).valueOf()) / 1000; // gets the number of seconds between now and the date referred to by expires
    return 'Expires=' + expires.toGMTString() + ';Max-Age=' + Math.round(n);
}

/**
 * Generate a valid HTTP cookie string from the given cookie object
 * @param {CookieObject} obj - An object containing information about the cookie
 * @returns {String} A valid HTTP cookie string
 */
exports.stringify = function(obj) {
    var value;
    try {
        value = encodeURIComponent(obj.value);
    } catch (e) {
        value = obj.value;
    }
    return [
        obj.name + '=' + value,
        (typeof obj.expires != 'undefined' && obj.expires ? printExpires(obj.expires) : ''),
        (typeof obj.path != 'undefined' ? (obj.path ? 'Path=' + obj.path : '') : 'Path=/'),
        (typeof obj.domain != 'undefined' && obj.domain ? 'Domain=' + obj.domain : ''),
        (typeof obj.secure != 'undefined' && obj.secure ? 'secure' : ''),
        (typeof obj.httponly != 'undefined' && obj.httponly ? 'HttpOnly' : '')
    ].join(';').replace(/;+/g, ';').replace(/;$/, '').replace(/;/g, '; '); // joins the array of cookie attributes with semicolons and replaces successive semicolons with just one
}

/**
 * Create an object containing information extracted from an HTTP cookie string
 * @param {String} string - A valid HTTP cookie string
 * @param {String} [path=/] - The default path if one is not found in the cookie string
 * @param {String} [domain] - The default domain if one is not found in the cookie string
 * @returns {CookieObject} An object containing information about the cookie
 */
exports.parse = function(string, path, domain) {
    // splits up the cookie string into an array of its various attributes
    var s = string.replace(/;\s+/g, ';').split(';')
        .map(function(s) {
            return s.replace(/\s+\=\s+/g, '=').split('=');
        });

    // removes the first element from s and stores in it n
    var n = s.shift();

    // sets up the default values for the cookie object to be returned
    var obj = {};
    obj.expires = false;
    obj.httponly = false;
    obj.secure = false;
    obj.path = path || '/';
    obj.domain = domain || '';

    // initializes the functions used to modify the cookie object
    var I, f = {
        'httponly': function() {
            obj.httponly = true;
        },
        'secure': function() {
            obj.secure = true;
        },
        'expires': function(v) {
            obj.expires = new Date(v);
        },
        'max-age': function(v) {
            if (obj.expires) return;
            obj.expires = new Date((new Date()).valueOf() + (v * 1000));
        },
        'path': function(v) {
            obj.path = v;
        },
        'domain': function(v) {
            obj.domain = v;
        }
    };

    // loops over each of the cookie's attributes and calls the respective method to modify the cookie object
    for (var i in s) {
        I = s[i][0].toLowerCase();
        if (typeof f[I] != 'undefined') f[I](s[i].length == 2 ? s[i][1] : '');
    }

    if (!obj.expires) obj.expires = 0;
    obj.name = n[0];
    try {
        obj.value = decodeURIComponent(n[1]);
    } catch (e) {
        obj.value = n[1];
    }
    return obj;
}

/**
 * Convert an array of name-value pairs into a semicolon-delimited string
 * @param {Object[]} array - An array of name-value pairs
 * @param {String} array[].name - A name
 * @param {String} array[].value - A value
 * @returns {String} A string containing the name-value pairs in the format "name1=value1; name2=value2; ..."
 */
exports.tokenize = function(array) {
    return array.map(function(s) {
        return s.name + '=' + encodeURIComponent(s.value);
    }).join('; ');
}
