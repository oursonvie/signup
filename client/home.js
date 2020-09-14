import SimpleSchema from 'simpl-schema';
// SimpleSchema.debug = true

Template.home.onCreated(function() {
  // check full status

  Session.set('searchStudent', false)
  Session.set('studentPhoto', false)
  Session.set('serverInfo', false)
  Session.set('student', false)

  PromiseMeteorCall('studentCount')
    .then(res => {
      Session.set('serverInfo', res)
    })
    .catch(err => {
      console.log(err)
    })

    // set test certno id

    Session.set('searchStudent', '130421198509023336')

    var self = this
    self.autorun(function() {
      // subscribe regiestered student

      if ( Session.get('searchStudent') ) {
        PromiseMeteorCall( 'searchStudent', Session.get('searchStudent') )
        .then( res => Session.set('student', res) )
        .catch( e => alert(e) )
      }

    });

});

Template.home.helpers({
  ifSearch: () => {
    return Session.get('searchStudent')
  },
  Students: function() {
    return Session.get('student').error == 0
  },
  StudentOne: function() {
    return Session.get('student').content
  },
  RegisterExipre: function() {
    let validSignupDate = moment().isAfter(Meteor.settings.public.startDate) && moment().isBefore(Meteor.settings.public.expireDate)

    if (Meteor.settings.public.startDate && Meteor.settings.public.expireDate && Meteor.settings.public.registerLimit) {
      return !validSignupDate || Session.get('serverInfo').studentCount >= Meteor.settings.public.registerLimit
    } else {
      return true
    }
  },
  ifEarly: function() {
    return moment().isBefore(Meteor.settings.public.startDate)
  },
  allowSignup: function() {
    let startDate = (this.status == '毕业') ? Meteor.settings.public.startDate : Meteor.settings.public.currentStudentDate

    let serverTime = Session.get('serverInfo').serverTime

    return moment.unix(serverTime).isAfter(startDate) && moment.unix(serverTime).isBefore(Meteor.settings.public.expireDate)

  },
  currentSetudentDate: function() {
    return Meteor.settings.public.currentStudentDate
  },
  serverInfo: function() {
    return Session.get('serverInfo')
  }
})

Template.home.events({
  "submit .checkID"(event, template) {

    event.preventDefault();

    let inputValue = document.getElementById('UserID').value.trim()

    let userId = inputValue.toUpperCase()

    Session.set('searchStudent', userId)

  }
});
