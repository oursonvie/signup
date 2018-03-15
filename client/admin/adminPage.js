Template.adminPage.onCreated(function() {
  // init search
  Session.set('searchStudent',false)

  var self = this
  self.autorun(function() {
    // subscribe regiestered student
    self.subscribe('regiesteredStudents');
    self.subscribe('StudentOne', Session.get('searchStudent'));
  });
});

Template.adminPage.helpers({
  signedNo: function() {
    return Student.find({edited:true}).count();
  },
  showCount: function() {
    return Session.get('submitCount');
  },
  Student: function() {
    return Student.findOne({certno:Session.get('searchStudent')});
  },
  ifSearch: function() {
    return Session.get('searchStudent');
  }
});

Template.adminPage.events({
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
  }
});


Template.nav.events({
  "click .btn-query" (event, template) {
    event.preventDefault();
    let userId = document.getElementById('UserID').value.trim().toUpperCase()
    Session.set('searchStudent', userId)
  },
  "click .btn-reset" (event, template) {
    event.preventDefault();
    Session.set('searchStudent', false)
  }
})
