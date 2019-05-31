Template.camPage.onCreated(function() {
  // init cameraList
  Session.set('cameraList', false)
});

Template.camPage.onRendered(function() {
  initCamera()
})


Template.camPage.helpers({
  ifSearching: function() {
    return Session.get('searching')
  }
});

Template.camPage.events({
  'click .btn-primary': function() {
    if ( !Session.get('searching') ) {
      if (document.getElementById("query").value) {
        faceCompareProcess()
      } else {
        queryCamProcess()
      }
    }
  },
  'click .btn-reset': function() {
    resetSessions()
    resetLocalStorage()
    document.getElementById("query").value = ''
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  },
  'click .btn-switch': function() {
    cameraList()
    $('#switchCameraModal').modal('show')
  },
  'click .btn-ocr': function() {
    let init_time = moment().valueOf()

    if (!Session.get('ocring')) {

      // change ocr status
      Session.set('ocring', true)

      // get pic from canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      // capture canvas image
      let base64 = canvas.toDataURL();

      console.log(`Base64 Session time: ${moment().valueOf() - init_time}`)

      console.log(`idCard size: ${base64.length}`)


      PromiseMeteorCall('idcardQuery', base64.split(',')[1])
        .then(res => {
          console.log(res)
          if (res) {
            console.log(`OCR process time: ${moment().valueOf() - init_time}`)
            Session.set('ocring', false)
            if (res.words_result.公民身份号码.words) {
              document.getElementById("query").value = res.words_result.公民身份号码.words
            } else {
              alert(res.image_status)
            }

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          } else {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          }

        })
        .catch(err => {
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          console.log(err)
        })

    }
  }
})
