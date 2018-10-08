import SimpleSchema from 'simpl-schema';
// SimpleSchema.debug = true

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

    let validSignupDate = moment().isAfter(Meteor.settings.public.startDate) && moment().isBefore(Meteor.settings.public.expireDate)

    if (Meteor.settings.public.startDate && Meteor.settings.public.expireDate && Meteor.settings.public.registerLimit) {
      return !validSignupDate || Counts.get('studentCount') >= Meteor.settings.public.registerLimit
    } else {
      return true
    }
  },
  ifEarly: function() {
    return moment().isBefore(Meteor.settings.public.startDate)
  }
})

Template.home.events({
  "submit .checkID" (event, template) {

    event.preventDefault();

    let inputValue = document.getElementById('UserID').value.trim()

    let userId = inputValue.toUpperCase()

    // search student photo for later user
    PromiseMeteorCall('getPhoto', userId).then(res => {
      if (res && res.fileexist) {
        //Bert.alert( '学生照片存在！', 'info', 'growl-top-right' );
        console.log('student picture exist')
        Session.set('studentPhoto', res)
      }
    }).catch(err => {
      if (err.reason == 'ETIMEDOUT [403]') {
        let selected = confirm("网络请求超时，请稍后重试");
        if (selected || !selected) {
          Session.set('searchStudent',false)
          Session.set('studentPhoto',false)
        }
      }
      console.log(err)
    })

    Session.set('searchStudent', userId)

  }
});

AutoForm.addHooks(['updateStudent'], {
  before: {
    update: function(doc) {
      if ( Roles.userIsInRole(this.userId, ['admin']) ) {
        if (Counts.get('studentCount') < Meteor.settings.public.registerLimit) {

          // seems not working
          if(doc.$unset.language != '') {
            let checkName = doc.$set.family_name + doc.$set.first_name

            if (/^[a-z]+$/i.test(checkName)) {

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
      } else {
        return doc
      }


    }
  },
  onSuccess: function(formType, result){
    if (formType == 'update' && result == 1) {

      // check if photo been fetched
      if (this && this.updateDoc && this.updateDoc.$set) {
        PromiseMeteorCall('pushChat', 'Update', this.updateDoc.$set)
        .then(res => console.log(res))
        .catch(err => console.log(err))
      }


      Session.set('searchStudent',false)
      Session.set('studentPhoto',false)
      document.getElementById('UserID').value = ''

      alert('报名成功，点击确认')
    }
  },
  onError: function (name, error, template) {
      console.log(name + " error:", error);
  }
});
