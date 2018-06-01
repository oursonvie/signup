Template.scandidate.onCreated(function() {
  Session.set('searchStudent',false)
  Session.set('searchStudent','612524199409150624')
  var self = this
  self.autorun(function() {
    self.subscribe('examCert', Session.get('searchStudent'));
  });
});

Template.scandidate.helpers({
  ifSearch: () => {
    return Session.get('searchStudent')
  },
  Students: function() {
    return Student.findOne({})
  },
  studenPhoto: function() {
    if (Image.find().count() == 0) {
      return false
    } else {
      return Image.findOne()
    }
  },
  seatsInfo: function() {
    return Seats.findOne()
  }
})

Template.scandidate.events({
  "submit .checkID" (event, template) {

    event.preventDefault();

    let inputValue = document.getElementById('nationid').value.trim()

    let userId = inputValue.toUpperCase()

    Session.set('searchStudent', userId)

  },
  "click .btn-reset" (event, template) {
    Session.set('searchStudent',false)
  }
});
