import SimpleSchema from 'simpl-schema';
SimpleSchema.debug = true

Template.home.onCreated(function() {
  Session.set('searchStudent',false)
  Session.set('studentPhoto',false)
  var self = this
  self.autorun(function() {
    self.subscribe('StudentOne', Session.get('searchStudent'));
    self.subscribe('studentCount');
  });
});

Template.home.helpers({
  ifSearch: () => {
    return Session.get('searchStudent')
  },
  Students: function() {
    return Student.findOne({})
  },
  photoExist: function() {
    return Session.get('studentPhoto').fileexist
  },
  RegisterExipre: function() {
    let currentRegister = Counts.get('studentCount');

    if (Meteor.settings.public.expireDate && Meteor.settings.public.registerLimit) {
      return moment().isAfter(moment(Meteor.settings.public.expireDate)) || Counts.get('studentCount') >= Meteor.settings.public.registerLimit
    } else {
      return true
    }
  }
})

Template.home.events({
  "submit .checkID" (event, template) {

    event.preventDefault();

    let inputValue = document.getElementById('UserID').value.trim()

    let userId = inputValue.toUpperCase()

    // search student photo for later user
    PromiseMeteorCall('getPhoto', userId).then(res => {
      if (res.fileexist) {
        //Bert.alert( '学生照片存在！', 'info', 'growl-top-right' );
        console.log('student picture exist')
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
      if (Counts.get('studentCount') < Meteor.settings.public.registerLimit) {

        if(doc.$set.language) {
          let checkName = doc.$set.family_name + doc.$set.first_name

          if (/^[a-z]+$/i.test(checkName)) {

            // add certno to update
            let certno = this.currentDoc.certno

            let updateInfo = doc.$set
            updateInfo.certno = certno

            PromiseMeteorCall('pushChat', 'Update', updateInfo)

            try {
              if (Session.get('studentPhoto') && Session.get('studentPhoto').fileexist ) {
                let studentInfo = this.currentDoc
                let studentPhoto = Session.get('studentPhoto')
                PromiseMeteorCall('addPhoto', studentInfo.certno, studentPhoto)
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
        } else {
          alert('请选择考试语言')
          return false
          throw new Meteor.Error('Input Error','Language missing')
        }

      } else {
        alert('报名人数已满')
        return false
        throw new Meteor.Error('Insert Error','Reach register upper limit')
      }
    }
  },
  onSuccess: function(formType, result){
    if (formType == 'update' && result == 1) {

      // check if photo been fetched
      // console.log(this.currentDoc)

      Session.set('searchStudent',false)
      document.getElementById('UserID').value = ''

      alert('报名成功，点击确认')
    }
  },
  onError: function (name, error, template) {
      console.log(name + " error:", error);
  }
});
