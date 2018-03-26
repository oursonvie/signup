import SimpleSchema from 'simpl-schema';
SimpleSchema.debug = true

Template.home.onCreated(function() {
  Session.set('searchStudent',false)
  Session.set('studentPhoto',false)
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
  }
})

Template.home.events({
  "submit .checkID" (event, template) {

    event.preventDefault();
    let userId = document.getElementById('UserID').value.trim().toUpperCase()

    // search student photo for later user
    PromiseMeteorCall('getPhoto', userId).then(res => {
      if (res.data.count > 0) {
        Bert.alert( '学生照片存在！', 'info', 'growl-top-right' );
      }
      Session.set('studentPhoto', res)
    }).catch(err => {
      console.log(err)
    })

    Session.set('searchStudent', userId)

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

        try {
          if (Session.get('studentPhoto') && Session.get('studentPhoto').data.count > 0 ) {
            let studentInfo = this.currentDoc
            let studentPhotos = Session.get('studentPhoto')
            PromiseMeteorCall('addOpenPhoto', studentInfo.certno, studentPhotos)
            .then(res => console.log(res))
            .catch(err => console.log(err))
          }
          return doc

        } catch(e) {
          console.log(e)
        }

      } else {
        alert('姓名只允许拼音')
        return false
        throw new Meteor.Error('Input Error','Only letter accepted')
      }
    }
  },
  onSuccess: function(formType, result){
    if (formType == 'update' && result == 1) {

      // check if photo been fetched
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
