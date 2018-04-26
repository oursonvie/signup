// import crypto to do the AES-128
var crypto = require('crypto');

// local var for AES encryption
const key = Meteor.settings.private.passkey;
const iv = Meteor.settings.private.passvi;

encryptAES = function(data) {
  // console.log(data)
  var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  var crypted = cipher.update(data, 'utf8', 'binary');
  crypted += cipher.final('binary');
  crypted = new Buffer(crypted, 'binary').toString('base64');
  // console.log(crypted);
  return crypted;
}

decryptAES = function(crypted) {
  // console.log(crypted)
  crypted = new Buffer(crypted, 'base64').toString('binary');
  var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  var decoded = decipher.update(crypted, 'binary', 'utf8');
  decoded += decipher.final('utf8');
  // console.log(decoded);
  return decoded;
}

Meteor.methods({
  convertCert: function(certno) {
    // encrypt certno
    let encrypted = encryptAES(certno)
    //console.log(`encrypted string: ${encrypted.toString()}`)

    // encode url
    let encodedString = encodeURIComponent(encrypted.toString())
    let result = `doc=${encodedString}`;
    // console.log(result)
    return result
  }
});
