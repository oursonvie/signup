Template.mobileHome.onCreated(function() {
  //reset sessions
  resetSessions()
  var self = this;
  self.autorun(function() {
    if (Session.get('studentNoQuery')) {
      self.subscribe('studentNoQuery', Session.get('studentNoQuery'))
    }
  })
});
