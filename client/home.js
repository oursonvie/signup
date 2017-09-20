// import SimpleSchema from 'simpl-schema';
// SimpleSchema.debug = true

Template.home.onCreated(function() {
  Session.set('searchStudent',false)
  var self = this
  self.autorun(function() {
    self.subscribe('StudentOne', Session.get('searchStudent'));
  });
});

Template.home.helpers({
  ifSearch: function() {
    return Session.get('searchStudent')
  },
  Students: function() {
    return Test.findOne({})
  }
})

Template.home.events({
  "submit .checkID" (event, template) {

    event.preventDefault();
    let userId = document.getElementById('UserID').value.trim()

    Session.set('searchStudent', userId)

  }
});

AutoForm.addHooks(['updateStudent'], {
  onSuccess: function(formType, result){
    if (formType == 'update' && result == 1) {
      alert('报名成功，点击确认')
      Session.set('searchStudent',false)
      document.getElementById('UserID').value = ''
    }
  },
  onError: function (name, error, template) {
      console.log(name + " error:", error);
  }
});
