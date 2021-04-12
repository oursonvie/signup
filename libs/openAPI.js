// md5 for open auth
EncryptAuthorInformation = () => {
  let dateNow = moment()
  let hour = dateNow.hour()
  let day = dateNow.date()
  let dayOfYear = dateNow.dayOfYear()

  let value = 'asdf1.23' + hour.toString() + day.toString() + dayOfYear.toString()

  let result = CryptoJS.MD5(value).toString().toUpperCase()

  return result
}

getOpenPhoto = (batchcode, certificateno) => {
  const appKey = Meteor.settings.private.appKey

  let url = `http://openapi.open.com.cn/api/GetStudentFile/GetStudentFileInfo?appKey=${appKey}&batchCode=${batchcode}&certificateNo=${certificateno}`

  try {
    result = Promise.await(PromiseHTTPCall(
      'GET',
      url, {
        headers: {
          key: EncryptAuthorInformation()
        }
      }
    ))

    // debug open api
    if (result.data.data.count > 0) {
      dataList = result.data.data.dataList

      zp = dataList[lodash.findIndex(dataList, {
        'filetype': 'zp'
      })]

      res = {
        filetype: 'zp',
        doccontent: zp.doccontent,
        certificateno: zp.certificateno,
        source: 'open',
        fileexist: ((zp.doccontent.length > 0) ? true : false)
      }

      return res
    }

  } catch (err) {
    console.log(err)

    throw new Meteor.Error('403', err.code)

  }

}
