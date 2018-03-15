import SimpleSchema from 'simpl-schema';
SimpleSchema.debug = true

Template.home.onCreated(function() {
  Session.set('searchStudent',false)
  var self = this
  self.autorun(function() {
    self.subscribe('StudentOne', Session.get('searchStudent'));
  });
});

Template.home.helpers({
  ifSearch: () => {
    return Session.get('searchStudent')
  },
  Students: function() {
    return Student.findOne({})
  },
  edited: function() {
    return this.edited
  }
})

Template.home.events({
  "submit .checkID" (event, template) {

    event.preventDefault();
    let userId = document.getElementById('UserID').value.trim().toUpperCase()

    Session.set('searchStudent', userId)

  }
});

Template.updatedStudentForm.events({
  "click .btn-close" (event, template) {

    Session.set('searchStudent',false)
    document.getElementById('UserID').value = ''
  }
});

AutoForm.addHooks(['updateStudent'], {
  before: {
    update: function(doc) {
      let checkName = doc.$set.family_name + doc.$set.first_name

      if (/^[a-z]+$/i.test(checkName)) {

        // add certno to update
        let certno = this.currentDoc.certno

        let updateInfo = doc.$set
        updateInfo.certno = certno

        PromiseMeteorCall('pushChat', 'update', updateInfo)

        return doc
      } else {
        alert('姓名只允许拼音')
        return false
        throw new Meteor.Error('Input Error','Only letter accepted')
      }
    }
  },
  onSuccess: function(formType, result){
    if (formType == 'update' && result == 1) {

      // console.log(this.currentDoc)

      alert('报名成功，点击确认')
      Session.set('searchStudent',false)
      document.getElementById('UserID').value = ''
    }
  },
  onError: function (name, error, template) {
      console.log(name + " error:", error);
  }
});
