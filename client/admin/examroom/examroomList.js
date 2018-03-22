Template.examroomList.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var id = FlowRouter.getParam('id');
        self.subscribe('examroomsOne', id);
    });
});

Template.examroomList.helpers({
  Students: function() {
    return student.find()
  },
  Seats: function() {
    return Examroom.findOne().seats
  }
})
