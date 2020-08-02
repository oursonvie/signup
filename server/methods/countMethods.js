Meteor.methods({
  studentCount: function() {
    return Student.find({
      edited: true
    }).count()
  },
  checkValidSignup: function(certno) {

    status = Student.findOne({
      certno: certno
    }).status

    signupCount = Student.find({
      edited: true
    }).count()

    reason = 0

    validStartDate = (status == '毕业') ? moment().isAfter(Meteor.settings.public.startDate) : moment().isAfter(Meteor.settings.public.currentStudentDate)

    if (signupCount >= Meteor.settings.public.registerLimit) {
      reason = '报名人数已满，报名结束'
    } else if (!validStartDate) {
      reason = '报名未开始'
    } else if (!moment().isBefore(Meteor.settings.public.expireDate)) {
      reason = '报名结束'
    } else {
      reason = 0
    }

    // return (reason) ? {error: reason} : {error:0}

    if (reason == 0) {
      // if reason is 0, do nothing
    } else {
      // else reset update

      result = Student.update({
        certno: certno
      }, {
        $set: {
          error: reason,
          family_name: '姓',
          first_name: '名',
          edited: false
        },
        $unset: {
          language: '',
        }
      })

      console.log(`[checkValidSignup] ${certno} error: ${reason} result: ${result}`)

    }
  }
});
