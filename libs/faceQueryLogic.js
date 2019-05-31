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
        let baiduRatio = Settings.findOne({
          valuename: 'baiduRatio'
        }).value

        // if pass baidu result
        if (res.result.user_list[0].score >= baiduRatio) {

          console.log(`FaceCompare Logic time: ${moment().valueOf() - init_time}`)

          console.log('Passed BaiduRatio')

          // prepare log file
          let logs = {}
          logs.studentPic = studentPic
          logs.createdAt = new Date()
          logs.baiduScore = res.result.user_list[0].score
          logs.baiduResult = res
          logs.createdBy = Meteor.userId()
          logs.methods = '人脸检索'

          // test time settings
          testTime = Session.get('testTime') ? Session.get('testTime') : Meteor.settings.public.testDate

          // check if there any exam to checkin return arrary to avaliable exam to checkin
          PromiseMeteorCall('checkInExam', res.result.user_list[0].user_id, testTime)
            .then(signInId => {
              // if return true
              if (signInId) {

                // insert Logs
                PromiseMeteorCall('insertLog', logs)
                  .then(updateId => {

                    // update current enrolled status
                    PromiseMeteorCall('updateSigninStatus', signInId, updateId, Meteor.userId())
                      .then(res => {
                        console.log(res)
                      })
                      .catch(err => {
                        console.log(err)
                      })

                  })
                  .catch(err => {
                    console.log(err)
                  })

                // double checkin validation
                PromiseMeteorCall('checkSigninStatus', signInId)
                  .then(signinStatus => {

                    if (signinStatus) {
                      alert('学生已经签到')
                    }

                  })
                  .catch(err => {
                    console.log(err)
                  })

              } else {
                console.log(`No exam schedule avaliable for checkin`)
              }
            })
            .catch(err => {
              console.log(err)
            })


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

    console.log(certNo)

    // get student pic from signup no
    PromiseMeteorCall('localPhotoLookUp', certNo)
      .then(targetPic => {
        Session.set('targetPic', targetPic)
        let studentPic = Session.get('studentPic')

        // check if there any exam to checkin return arrary to avaliable exam to checkin
        PromiseMeteorCall('validateCheckin', certNo, Session.get('testTime'))
          .then(signInId => {

            if (signInId) {

              // if return valid exam info save to session
              Session.set('examroomSubNo', signInId)

              // image compare if pass provoke signin
              PromiseMeteorCall('baidu_compare', studentPic.split(',')[1], targetPic.split(',')[1])
                .then(res => {
                  console.log(`baidu_compare time: ${moment().valueOf() - init_time}`)
                  Session.set('baiduResult', res)

                  Session.set('searching', false)

                  if (res.error_code == 0) {
                    console.log(`facial passing rate: ${res.result.score}`)
                    let baiduRatio = Settings.findOne({
                      valuename: 'baiduRatio'
                    }).value

                    // prepare log file
                    let logs = {}
                    logs.studentPic = studentPic
                    logs.certno = certNo
                    logs.createdAt = new Date()
                    logs.baiduScore = res.result.score
                    logs.baiduResult = res
                    logs.createdBy = Meteor.userId()
                    logs.methods = '巡考核查'

                    logs.signinid = signInId

                    PromiseMeteorCall('insertValidationLog', logs)
                      .then(upsertId => {
                        console.log(upsertId)

                        // if pass baidu result
                        if (res.result.score >= baiduRatio) {
                          alert(`学生核查通过`)
                        } else {
                          alert(`学生核查未通过`)
                        }

                      })
                      .catch(err => {
                        console.log(err)
                      })


                  } else {
                    // error handling for baidu error
                    error_code = res.error_code
                    alert(errorCodeHanding(error_code))
                  }

                })


            } else {
              Session.set('searching', false)
              alert(`学生没有可核查考试`)
            }


          })
          .catch(err => {
            console.log(err)
          })





      })
      .catch(err => {
        Session.set('searching', false)
        alert(err)
      })
  }
}
