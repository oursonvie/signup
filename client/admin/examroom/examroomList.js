Template.examroomList.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var examroomId = parseInt(FlowRouter.getParam('id'));
        self.subscribe('examroomsOne', examroomId);
        self.subscribe('seatsStudentExamroom', examroomId);
    });
});

Template.examroomList.helpers({
  Seats: function() {
    return Seats.find()
  },
  ExamroomNumber: function() {
    return FlowRouter.getParam('id').padStart(3, '0')
  },
  thisRoom: function() {
    return Examroom.findOne()
  }
})

Template.examroomList.events({
  'click .btn-download': function() {
    let link = `${Meteor.absoluteUrl()}api/examroom?roomnumber=${FlowRouter.getParam('id')}`
    window.open(link);

  },
  'click .fa-eye': function() {
    PromiseMeteorCall('convertCert', this.certno)
    .then(res => {
      let link = `${Meteor.absoluteUrl()}api/pdf?${res}`
      window.open(link);
    })
    .catch(err => console.log(err))
  }
})
