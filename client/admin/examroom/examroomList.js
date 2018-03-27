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
