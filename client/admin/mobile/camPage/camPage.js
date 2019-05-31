Template.camPage.onCreated(function() {
  // init cameraList
  Session.set('cameraList', false)

  var self = this;
  self.autorun(function() {

    // self.subscribe('examlocationList')

  })

});

Template.camPage.onRendered(function() {
  initCamera()
})


Template.camPage.helpers({
  ifSearching: function() {
    return Session.get('searching')
  }
});

Template.camPage.events({
  'click .btn-primary': function() {
    if ( !Session.get('searching') ) {
      queryCamProcess()
    }
  },
  'click .btn-reset': function() {
    resetSessions()
    resetLocalStorage()
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  },
  'click .btn-switch': function() {
    cameraList()
    $('#switchCameraModal').modal('show')
  }
})
