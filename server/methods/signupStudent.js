Meteor.methods({
  signupStudent:function(id, familyName, firstName, language) {
    // console.log(id, familyName, firstName, language)

    // check signup criteria
    let studentStatus = Student.findOne({_id: id}).status

    validStartDate = (studentStatus == '毕业') ? moment().isAfter(Meteor.settings.public.startDate) : moment().isAfter(Meteor.settings.public.currentStudentDate)

    // signup number

    if ( !signupNumberValid() ) {
      throw new Meteor.Error('505', `报名人数已满`);
    } else if ( moment().isBefore(Meteor.settings.public.startDate) || moment().isAfter(Meteor.settings.public.expireDate) ) {
      throw new Meteor.Error('504', `不在报名时间内，具体报名时间以服务器时间为准`);
    } else if ( !validStartDate ) {
      throw new Meteor.Error('503', `请检查学籍以及允许报名的时间`);
    } else {
      // when everything checked out, signup student

      result = Student.update({_id:id},{$set:{
        family_name: familyName,
        first_name: firstName,
        language: language
      }})

      if (result == 1) {
        return `success`
      } else {
        return `fail`
      }

    }

    // student status

    // signup students
  }
});

signupNumberValid = () => {
  return Student.find({edited: true}).count() < Meteor.settings.public.registerLimit
}
