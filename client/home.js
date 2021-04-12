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
    let serverseInfo = Session.get('serverInfo')

    if ( Meteor.settings.public.startDate && Meteor.settings.public.expireDate && Meteor.settings.public.examChoice && serverseInfo) {

      // check sub exam time are all full
      let examTimes = Meteor.settings.public.examChoice
      let currentSignedin = serverseInfo.dateCount

      let allFull = true


      _.forEach(examTimes, function(time) {
        // get current signed number
        let currentIDindex = lodash.findIndex(currentSignedin, { '_id':time.id.toString() })
        let currentSignedNo = currentSignedin[currentIDindex].count
        if (currentSignedNo < time.limit) {
          allFull = allFull && false
        } else {
          allFull = allFull && true
        }
      })
      return !validSignupDate || allFull
    } else if ( Meteor.settings.public.startDate && Meteor.settings.public.expireDate && Meteor.settings.public.registerLimit ) {
      return !validSignupDate || serverseInfo.studentCount >= Meteor.settings.public.registerLimit
    } else {
      return true
    }
  },
  ifEarly: function() {
    return moment().isBefore(Meteor.settings.public.startDate)
  },
  allowSignup: function() {
    let studentInfo = Session.get('student')
    let startDate = (studentInfo.error == 0 && studentInfo.content.status == '毕业') ? Meteor.settings.public.startDate : Meteor.settings.public.currentStudentDate

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

    PromiseMeteorCall( 'searchStudent', Session.get('searchStudent') )
    .then(
      res => {
        Session.set('student', res)
        if (res.error != 0) {
          alert( JSON.stringify(res) )
        }
      }
    )
    .catch( e => alert(e) )

  }
});
