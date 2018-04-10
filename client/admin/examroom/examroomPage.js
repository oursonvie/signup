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
    PromiseMeteorCall('randomlizeExamroom')
    .then(res => {
      Session.set('randomExamroom', res)
    })
    .catch(err => console.log(err))
  },
  'click .btn-download': function() {
    console.log('download examroom template')


    PromiseMeteorCall('downloadExamRoom')
    .then(res => {
      if (res) {
        let blob = new Blob([res], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, '教室编号.csv')
      }
    })

  },
  'click .btn-seat-download': function() {
    console.log('download seating infor')


    PromiseMeteorCall('downloadSeats')
    .then(res => {
      if (res) {
        let blob = new Blob([res], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, '座位列表.csv')
      }
    })
  },
  'click .btn-clean': function() {
    PromiseMeteorCall('cleanExamroom')
    .then(res => console.log(res))
    .catch(err => console.log(err))
  },
  // import function
  'change #examroomUpload': function(event, template) {
    // check datetime been set for the current examnation
    dateInfo = Session.get('setDate')

    let filesList = event.currentTarget.files;
    if (filesList.length) {
      let file = filesList[0];
      if (file.type === 'text/csv') {
        let fileReader = new FileReader();
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
