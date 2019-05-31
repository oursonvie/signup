Template.mobileHome.onCreated(function() {
  //reset sessions
  resetSessions()
  var self = this;
  self.autorun(function() {
    // sub to settings
    self.subscribe('Settings')
    if (Session.get('studentNoQuery')) {
      self.subscribe('studentNoQuery', Session.get('studentNoQuery'))
    }
  })
});
