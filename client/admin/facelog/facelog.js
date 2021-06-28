Template.facelog.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('facelogs');
    });
});


Template.facelog.helpers({
  Facelogs: function() {
    return FaceLogs.find({}, {sort:{createdAt:-1}})
  },
  dateTime: function() {
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
  }
})
