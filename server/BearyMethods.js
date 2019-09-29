Meteor.methods({
  pushChat: function(input, message) {
    // http post setting

      var postData = {
        "text": `[${input}] ${JSON.stringify(message)}`
      }

      return bearySend(postData)

  },
  bearyFaceMatch: function(id, api) {
    PromiseMeteorCall('pushChat', 'API Match', api)
  }
});

bearySend = (content) => {
  var url = 'https://hook.bearychat.com/=bw6fh/incoming/0359b75248dfa1404c2df9c4472323e3'

  try {
    result = Promise.await(PromiseHTTPCall('POST', url, {data:content}))

    return result.content
  } catch (e) {
    console.log(e)
  }
}
