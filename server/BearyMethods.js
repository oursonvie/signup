Meteor.methods({
  pushChat: function(input, message) {
    // http post setting

      var postData = {
        "text": `[${input}] ${JSON.stringify(message)}`
      }

      return slackSend(postData)

  },
  bearyFaceMatch: function(id, api) {
    PromiseMeteorCall('pushChat', 'API Match', api)
  }
});


slackSend = (content) => {
  try {
    result = Promise.await(PromiseHTTPCall('POST', Meteor.settings.private.slackUrl, {
      data: content
    }))

    console.log(result.content)
  } catch (e) {
    console.log(e)
  }
}

callBearyChat = (lcenter, url) => {
  alt = {
    "blocks": [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `发现活体检测不通过学生，来自: ${lcenter}`
      },
      "accessory": {
        "type": "image",
        "image_url": url,
        "alt_text": "image"
      }
    }]
  }

  slackSend(alt)

}

Meteor.methods({
  slackSendText: function(string) {
    // content = JSON.stringify({text:string})
    content = {
      text: string
    }

    try {
      result = Promise.await(PromiseHTTPCall('POST', Meteor.settings.private.slackUrl, {
        data: content
      }))

      return result
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  }
});
