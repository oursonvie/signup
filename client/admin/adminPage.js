Template.studentPage.onCreated(function() {
  // init search
  Session.set('searchStudent',false)

  var self = this
  self.autorun(function() {
    // subscribe regiestered student
    self.subscribe('studentCount');
    self.subscribe('photoCount');
    self.subscribe('StudentOne', Session.get('searchStudent'));
    //count for 5 languages

    self.subscribe('studentCountLanguage');
  });
});

Template.studentPage.helpers({
  signedNo: function() {
    return Counts.get('studentCount');
  },
  photodNo: function() {
    return Counts.get('photoCount');
  },
  showCount: function() {
    return Session.get('submitCount');
  },
  Student: function() {
    return Student.findOne({certno:Session.get('searchStudent')});
  },
  ifSearch: function() {
    return Session.get('searchStudent');
  },
  languages: function() {
    return LanguageList()
  },
  languageSignedNo: function(lang) {
    return Counts.get(lang, lang);
  }
});

Template.studentPage.events({
  'click .btn-download': function() {
    var nameFile = '学生名单.csv'
    Meteor.call('download', function(err, fileContent) {
      if (fileContent) {

        var blob = new Blob([fileContent], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, nameFile);
      }
    });
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
            Meteor.call('importStudent', papaObject.data)
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
  }
});
