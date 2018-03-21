Template.examroomPage.onCreated(function() {
    var self = this
  self.autorun(function() {
    // subscribe regiestered student count
    self.subscribe('studentCount');
    self.subscribe('examrooms');
  });
});

Template.examroomPage.helpers({
  studentCount: function() {
    return Counts.get('studentCount')
  },
  examroomNeeded: function() {
    return Math.ceil(Counts.get('studentCount')/30)
  },
  examrooms: function() {
    return Examroom.find()
  }
});

Template.examroomPage.events({
  'click .btn-random': function() {
    console.log(123)
    PromiseMeteorCall('randomlizeExamroom')
    .then(res => {
      Session.set('randomExamroon', res)
    })
    .catch(err => console.log(err))
  },
  // import function
  'change #examroomUpload': function(event, template) {
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
            Meteor.call('importExamroom', papaObject.data)
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
