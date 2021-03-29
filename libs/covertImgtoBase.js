getXjtuUrl = (url) => {
  try {
    const response = Promise.await(PromiseHTTPCall(
      'GET',
      url,
      {
        npmRequestOptions: { encoding: null },
        timeout: 3000
      }
    ))

    // get base64 image
    let baseImage = "data:" + response.headers["content-type"] + ";base64," + new Buffer.from(response.content).toString('base64');

    return baseImage
  } catch(err) {
    // throw new Meteor.Error('invalid pic', "Can't find pic on server");
    return ''
  }
}

getXjtuPhoto = (sid) => {
  let baseurl = `http://${Meteor.settings.private.xueliPicServer}/10698/`

    let student = Student.findOne({signupid:sid})

    let batchid = sid.slice(8,12)
    let lcenter = sid.slice(5,8)

    if (batchid.length == 0 || lcenter.length == 0) {
      throw new Meteor.Error('invalid input', 'invalid SignupID');
    } else {
      //convert sid into pic url
      let zpurl = baseurl + 'zp' + '/' + batchid + '/' + lcenter + '/' + 'zp' + sid + '.jpg'
      let sfpzurl = baseurl + 'sfzp' + '/' + batchid + '/' + lcenter + '/' + 'sfzp' + sid + '.jpg'


      let photoZp = (getXjtuUrl(zpurl)) ? getXjtuUrl(zpurl) : getXjtuUrl(sfpzurl)

      result = {
        filetype: 'zp',
        doccontent:photoZp,
        certificateno: student.certno,
        source: 'xjtu',
        fileexist: (( photoZp.length > 0 ) ? true : false )
      }

      return result
    }
}

getImgUrl = (url) => {
  try {
    const response = Promise.await(PromiseHTTPCall(
      'GET',
      url,
      {
        npmRequestOptions: { encoding: null },
        timeout: 3000
      }
    ))

    // get base64 image
    let baseImage = "data:" + response.headers["content-type"] + ";base64," + new Buffer.from(response.content).toString('base64');

    return baseImage
  } catch(err) {
    console.log(`[getImgUrl] TargetUrl: ${url}, Error: ${JSON.stringify(err)}`)
    return ''
  }
}
