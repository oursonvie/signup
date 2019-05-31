queryCamProcess = () => {
  resetSessions()

  Session.set('searching', true)

  // get pic from canvas
  canvas.width = video.videoWidth / 2;
  canvas.height = video.videoHeight / 2;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  // capture canvas image
  let base64 = canvas.toDataURL();

  console.log(`base64 image size: ${base64.length}`)

  let init_time = moment().valueOf()

  // set student pic to base64
  Session.set('studentPic', base64)

  console.log(`Base64 Session time: ${moment().valueOf() - init_time}`)

  // preinput lcenter _id in lcenterMind

  group_id = 'students'

  let studentPic = Session.get('studentPic')

  // image compare if pass provoke signin
  PromiseMeteorCall('baidu_face_search', studentPic.split(',')[1], group_id)
    .then(res => {
      console.log(`baidu_compare time: ${moment().valueOf() - init_time}`)
      Session.set('searching', false)

      Session.set('baiduResult', res)

      if (res.error_code == 0) {

        // subscribe to student
        Session.set('studentNoQuery', res.result.user_list[0].user_id)


        console.log(`facial passing rate: ${res.result.user_list[0].score}`)

        // prepare log file
        let logs = {}
        logs.studentPic = studentPic
        logs.createdAt = new Date()
        logs.baiduScore = res.result.user_list[0].score
        logs.baiduResult = res
        logs.createdBy = Meteor.userId()
        logs.methods = '人脸检索'

        PromiseMeteorCall('insertFaceLog', logs)
          .then(res => {
            console.log(`[Log inserted] ${res}`)
          })
          .catch(err => {
            cosnole.log(err)
          })

        // if pass baidu result
        if (res.result.user_list[0].score >= Meteor.settings.public.baiduRatio) {

          console.log(`FaceCompare Logic time: ${moment().valueOf() - init_time}`)

          console.log('Passed BaiduRatio')


        } else {
          alert('人脸比对不通过')
          console.log(`Didn't pass test`)
        }

      } else {
        // error handling for baidu error
        alert(errorCodeHanding(res.error_code))

      }

    })
}

faceCompareProcess = () => {
  // get input student id
  let certNo = document.getElementById("query").value.trim()

  if (certNo) {
    // turn searching status to true
    Session.set('searching', true)

    // get pic from canvas
    canvas.width = video.videoWidth / 2.3;
    canvas.height = video.videoHeight / 2.3;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // capture canvas image
    let base64 = canvas.toDataURL();

    console.log(`base64 image size: ${base64.length}`)

    let init_time = moment().valueOf()

    // set student pic to base64
    Session.set('studentPic', base64)

    console.log(`Base64 Session time: ${moment().valueOf() - init_time}`)

    // subscribe to student
    Session.set('certNoQuery', certNo)

    // subscribe to student
    PromiseMeteorCall('certnoStudentIdLoopUp', certNo)
    .then( res => {
      Session.set('studentNoQuery', res)
    })
    .catch( err => {
      console.log(err)
    })

    // get student pic from signup no
    PromiseMeteorCall('certnoPhotoLookUp', certNo)
      .then(targetPic => {
        Session.set('targetPic', targetPic)
        let studentPic = Session.get('studentPic')

        // image compare if pass provoke signin
        PromiseMeteorCall('baidu_compare', studentPic.split(',')[1], targetPic.split(',')[1])
          .then(res => {



            console.log(`baidu_compare time: ${moment().valueOf() - init_time}`)
            Session.set('baiduResult', res)

            Session.set('searching', false)

            if (res.error_code == 0) {
              console.log(`facial passing rate: ${res.result.score}`)

              // prepare log file
              let logs = {}
              logs.studentPic = studentPic
              logs.certno = certNo
              logs.createdAt = new Date()
              logs.baiduScore = res.result.score
              logs.baiduResult = res
              logs.createdBy = Meteor.userId()
              logs.methods = '人脸比对'

              // if pass baidu result
              if (res.result.score >= Meteor.settings.public.baiduRatio) {

                console.log(`FaceCompare Logic time: ${moment().valueOf() - init_time}`)

                console.log('Passed BaiduRatio')


              } else {
                alert('人脸比对不通过')
                console.log(`Didn't pass test`)
              }



            } else {
              // error handling for baidu error
              error_code = res.error_code
              alert(errorCodeHanding(error_code))
            }

          })


      })
      .catch(err => {
        Session.set('searching', false)
        alert(err)
      })
  }
}
