Meteor.methods({
  studentCount: function() {
    return Student.find({edited:true}).count()
  },
  checkValidSignup: function(certno) {

    status = Student.findOne({certno:certno}).status

    signupCount = Student.find({edited:true}).count()

    reason = false

    validStartDate = (status == '毕业') ? moment().isAfter(Meteor.settings.public.startDate) : moment().isAfter(Meteor.settings.public.currentStudentDate)

    console.log(validStartDate)

    if ( signupCount >= Meteor.settings.public.registerLimit ) {
      reason = '报名人数已满，报名结束'
    } else if ( !validStartDate ) {
      reason = '报名未开始'
    } else if ( !moment().isBefore(Meteor.settings.public.expireDate) ) {
      reason = '报名结束'
    } else {
      reason = false
    }

    return (reason) ? {error: reason} : {error:0}

  }
});
