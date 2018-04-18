var AES = require("crypto-js/aes");

Meteor.methods({
  convertCert: function(certno) {
    // decrypt certno using passphase
    let decrypted = AES.encrypt(certno, Meteor.settings.private.passphrase);
    // console.log(`encrypted string: ${decrypted.toString()}`)
    
    // encode url
    let encodedString = encodeURIComponent(decrypted.toString())
    let result = `doc=${encodedString}`;
    // console.log(result)
    return result
  }
});
