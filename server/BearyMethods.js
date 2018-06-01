Meteor.methods({
  pushChat: function(input, message) {
    // http post setting
      var request = require('request')
      var url = 'https://hook.bearychat.com/=bw6fh/incoming/0359b75248dfa1404c2df9c4472323e3'

      //

      var postData = {
        "text": `[${input}] ${JSON.stringify(message)}`
      }

      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: url
      }

      request(options, function (err, res, body) {
        if (err) {
          console.error('error posting json: ', err)
          throw err
        }
        var headers = res.headers
        var statusCode = res.statusCode
        // console.log('statusCode: ', statusCode)
      })

  },
  bearyFaceMatch: function(id, api) {
    PromiseMeteorCall('pushChat', '[API Match]', api)
  }
});
