getXjtuUrl = (url) => {
  try {
    const response = Promise.await(PromiseHTTPCall(
      'GET',
      url,
      {npmRequestOptions: { encoding: null }}
    ))

    // get base64 image
    let baseImage = "data:" + response.headers["content-type"] + ";base64," + new Buffer(response.content).toString('base64');

    return baseImage
  } catch(err) {
    // throw new Meteor.Error('invalid pic', "Can't find pic on server");
    return ''
  }
}

getXjtuPhoto = (sid) => {
  let baseurl = 'http://mxueli.xjtudlc.com/Upload/StudentPicture/10698/'

    let student = Student.findOne({signupid:sid})

    let batchid = sid.slice(8,12)
    let lcenter = sid.slice(5,8)

    if (batchid.length == 0 || lcenter.length == 0) {
      throw new Meteor.Error('invalid input', 'invalid SignupID');
    } else {
      //convert sid into pic url
      let zpurl = baseurl + 'zp' + '/' + batchid + '/' + lcenter + '/' + 'zp' + sid + '.jpg'
      let sfpzurl = baseurl + 'sfzp' + '/' + batchid + '/' + lcenter + '/' + 'sfzp' + sid + '.jpg'

      // console.log(zpurl)
      // console.log(sfpzurl)

      let photoZp = getXjtuUrl(zpurl)
      let photoSfpzurl = getXjtuUrl(sfpzurl)

      let filecount = ((photoZp) ? 1 : 0) + ((photoSfpzurl) ? 1 : 0)

      result = {
        data: {
          count: filecount,
          dataList: [
            {filetype:'zp', doccontent:photoZp, certno: student.certno},
            {filetype:'sfpzurl', doccontent:photoSfpzurl, certno: student.certno}
          ]
        }
      }

      return result
    }
}
