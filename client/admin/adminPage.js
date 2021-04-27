Template.studentPage.onCreated(function() {
  // init search
  Session.set('searchStudent',false)
  Session.set('student', false)

  var self = this
  self.autorun(function() {
    // subscribe regiestered student
    self.subscribe('studentCount');
    self.subscribe('photoCount');
    self.subscribe('baiduCount');
    //  count for 5 languages
    self.subscribe('studentCountLanguage');
    self.subscribe('studentCountByTime');

    if ( Session.get('searchStudent') ) {
      PromiseMeteorCall( 'searchStudent', Session.get('searchStudent') )
      .then( res => {
        Session.set('student', res)
      } )
      .catch( e => alert(e) )
    }

  });
});

Template.studentPage.helpers({
  signedNo: function() {
    return Counts.get('signedStudentCount');
  },
  totalStudentCount: function() {
    return Counts.get('studentCount');
  },
  errorCount: function() {
    return Counts.get('errorStudent');
  },
  photodNo: function() {
    return Counts.get('photoCount');
  },
  showCount: function() {
    return Session.get('submitCount');
  },
  Student: function() {
    return Session.get('student').content
  },
  ifSearch: function() {
    return Session.get('searchStudent');
  },
  languages: function() {
    return LanguageList()
  },
  languageSignedNo: function(lang) {
    return Counts.get(lang, lang);
  },
  examRoomCount: function(lang) {
    return Math.ceil(Counts.get(lang, lang)/30);
  },
  baiduCount: function() {
    return Counts.get('syncedCount');
  },
  timeList: function() {
    return Meteor.settings.public.examChoice
  },
  signedByTime: function(examId) {
    return Counts.get(examId.toString())
  }
});

Template.studentPage.events({
  'click .btn-download': function() {
    var nameFile = '学生名单.csv'

    PromiseMeteorCall('download')
    .then(res => {
      if (res) {
        let blob = new Blob([res], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, nameFile)
      }
    })
  },
  // import function
  'change #hiddenUpload': function(event, template) {
    var filesList = event.currentTarget.files;
    if (filesList.length) {
      var file = filesList[0];
      if (file.type === 'text/csv') {
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
          var papaObject = CSV.parse(fileReader.result, {
            header: true,
            encoding: "UTF-8"
          });
          console.log('papaObject', papaObject);

          if (papaObject && papaObject.errors.length == 0) {
            PromiseMeteorCall('importStudent', papaObject.data)
            .then ( res => {
              console.log(res)
            })
            .catch( err => {
              console.log(err)
            })
          } else {
            throw papaObject.errors
          }

          Session.set('uploadedData', papaObject);
        };
        fileReader.onerror = function(e) {
          throw 'Error reading CSV file';
        };
        fileReader.readAsText(file);
      }
    }
  },
  // update student status function
  'change #changeStatus': function(event, template) {
    var filesList = event.currentTarget.files;
    if (filesList.length) {
      var file = filesList[0];
      if (file.type === 'text/csv') {
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
          var papaObject = CSV.parse(fileReader.result, {
            header: true,
            encoding: "UTF-8"
          });
          console.log('papaObject', papaObject);

          if (papaObject && papaObject.errors.length == 0) {
            Meteor.call('updateStudentLevel', papaObject.data)
          } else {
            throw papaObject.errors
          }

          Session.set('uploadedData', papaObject);
        };
        fileReader.onerror = function(e) {
          throw 'Error reading CSV file';
        };
        fileReader.readAsText(file);
      }
    }
  },
  'click .fa-download-languages': function(event, template) {
    let targetLanguage = this.value
    var nameFile = `${targetLanguage}考试名单.csv`
    PromiseMeteorCall('downloadStudentViaLanguage', targetLanguage)
    .then(fileContent => {
      if(fileContent) {
        var blob = new Blob([fileContent], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, nameFile);
      } else {
        console.log('Nothing to download')
      }
    })
    .catch(err => console.log(err))
  },
  'click .btn-syncBaidu': function() {
    // sync studentPic
    PromiseMeteorCall('syncAllStudents')
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  },
  'click .btn-baidu-createList': function() {
    PromiseMeteorCall('updateBaiduList')
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  },
  "click .btn-checkPhoto": function() {
    PromiseMeteorCall('checkPhoto')
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  },
  "click .btn-photo-download": function() {

    PromiseMeteorCall('getAllPicId')
    .then(items => {

      console.log(items.length)

      if (items.length > 0) {

        _.forEach(items, function(item, index) {
          setTimeout(function(){
            downloadPic(item)
        },
        1000*index);

        })

      }
    })
    .catch(err => {
      console.log(err)
    })

  }
});


downloadPic = (item) => {

  PromiseMeteorCall('downloadPic',item._id)
  .then( res => {
    var blob = b64toBlob(res.realData, res.contentType);
    var filename = item.certificateno
    console.log(`[Saving] ${filename}`)
    saveAs(blob, filename);
  })
  .catch(e => {
    console.log(e)
  })

}
