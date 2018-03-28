Template.examroomPage.onCreated(function() {
  Session.set('setDate', {edit:false} )

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
  },
  ifSetTime: function() {
    return Session.get('setDate').edit
  },
  examtime: function() {
    dateInfo = Session.get('setDate')
    if (dateInfo && dateInfo.starttime && dateInfo.duration) {
      starttime = moment(dateInfo.starttime).format('YYYY-MM-DD HH:mm')
      duration = dateInfo.duration
      endtime = moment(starttime).add(duration, 'hours').format('HH:mm')
      return `考试日期：${starttime} - ${endtime}`
    }
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
  'click .btn-clean': function() {
    PromiseMeteorCall('cleanExamroom')
    .then(res => console.log(res))
    .catch(err => console.log(err))
  },
  'click .btn-setdate': function() {
    Session.set('setDate', {edit:!Session.get('setDate').edit})
  },
  // import function
  'change #examroomUpload': function(event, template) {
    // check datetime been set for the current examnation
    dateInfo = Session.get('setDate')

    if (dateInfo.starttime != undefined && dateInfo.duration != undefined) {
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
              Meteor.call('importExamroom', papaObject.data, dateInfo)
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
    } else {
      alert("导入教室前请先设置考试时间")
    }
  }
});
