import SimpleSchema from 'simpl-schema';
// SimpleSchema.debug = true

Template.home.onCreated(function() {
  Session.set('searchStudent', false)
  Session.set('studentPhoto', false)

  // get certno
  certno = FlowRouter.getQueryParam("query")

  if (certno) {
    Session.set('searchStudent', certno)
  }

  var self = this
  self.autorun(function() {
    self.subscribe('StudentOne', Session.get('searchStudent'));
    self.subscribe('studentCount');
  });
});

Template.home.onRendered(function() {
  if (Session.get('searchStudent')) {
    document.getElementById('UserID').value = certno.toUpperCase()
  }
})

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
    let validSignupDate = moment().isAfter(Meteor.settings.public.startDate) && moment().isBefore(Meteor.settings.public.expireDate)

    if (Meteor.settings.public.startDate && Meteor.settings.public.expireDate && Meteor.settings.public.registerLimit) {
      return !validSignupDate || Counts.get('signedStudentCount') >= Meteor.settings.public.registerLimit
    } else {
      return true
    }
  },
  ifEarly: function() {
    return moment().isBefore(Meteor.settings.public.startDate)
  },
  allowSignup: function() {
    startDate = (this.status == '毕业') ? Meteor.settings.public.startDate : Meteor.settings.public.currentStudentDate

    return validSignupDate = moment().isAfter(startDate) && moment().isBefore(Meteor.settings.public.expireDate)
  },
  currentSetudentDate: function() {
    return Meteor.settings.public.currentStudentDate
  }
})

Template.home.events({
  "submit .checkID"(event, template) {

    event.preventDefault();

    let inputValue = document.getElementById('UserID').value.trim()

    let userId = inputValue.toUpperCase()

    // Session.set('searchStudent', userId)
    window.location.replace(`?query=${userId}`);

  }
});

AutoForm.addHooks(['updateStudent'], {
  before: {
    update: function(doc) {
      if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        return doc
      } else {
        if (Counts.get('signedStudentCount') < Meteor.settings.public.registerLimit) {

          if (moment().isAfter(Meteor.settings.public.startDate) && moment().isBefore(Meteor.settings.public.expireDate)) {

            if (doc.$set.language) {
              let checkName = doc.$set.family_name + doc.$set.first_name

              if (/^[a-z]+$/i.test(checkName)) {

                return doc

              } else {
                alert('姓名只允许拼音')
                return false
                throw new Meteor.Error('Input Error', 'Only letter accepted')
              }
            } else {
              alert('请选择考试语言')
              return false
              throw new Meteor.Error('Input Error', 'Language missing')
            }

          } else {
            alert('不在报名时间内')
          }

        } else {
          alert('报名人数已满')
          return false
          throw new Meteor.Error('Insert Error', 'Reach register upper limit')
        }

      }

    }
  },
  onSuccess: function(formType, result) {
    if (formType == 'update' && result == 1) {

      // check if photo been fetched
      if (this && this.updateDoc && this.updateDoc.$set) {
        PromiseMeteorCall('pushChat', 'Update', this.updateDoc.$set)
          .then(res => console.log(res))
          .catch(err => console.log(err))
      }


      Session.set('searchStudent', false)
      Session.set('studentPhoto', false)
      document.getElementById('UserID').value = ''

      alert(`报名成功，请截图保存您的报名编号: ${this.docId}`)
    }
  },
  onError: function(name, error, template) {
    console.log(name + " error:", error);
  }
});
