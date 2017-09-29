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
  ifSearch: function() {
    return Session.get('searchStudent')
  },
  Students: function() {
    return Test.findOne({})
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

      console.log(checkName)

      if (/^[a-z]+$/i.test(checkName)) {

        // backup insert to db
        let backupDoc = this.currentDoc
        //remove key
        delete backupDoc["_id"]

        // make capticalized on names
        doc.$set.family_name = lodash.capitalize(doc.$set.family_name);
        doc.$set.first_name = lodash.capitalize(doc.$set.first_name);

        //check if string are empty
        let checkString = backupDoc.family_name + backupDoc.first_name + backupDoc.phone + backupDoc.company

        if (checkString.trim().length > 0) {
          Meteor.call('insertToBackup', backupDoc)
        }

        PromiseMeteorCall('pushChat', 'update', this.currentDoc)

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
