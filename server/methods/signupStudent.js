Meteor.methods({
  signupStudent: function(id, familyName, firstName, language, examTime) {

    // admin can just update student
    if ( this.userId && Roles.userIsInRole(this.userId, ['admin']) ) {
      result = Student.update({
        _id: id
      }, {
        $set: {
          family_name: familyName,
          first_name: firstName,
          language: language,
          examTime: examTime
        }
      })

      if (result == 1) {
        return `success`
      } else {
        return `fail`
      }
    } else {
      // check signup criteria
      let studentStatus = Student.findOne({
        _id: id
      }).status

      validStartDate = (studentStatus == '毕业') ? moment().isAfter(Meteor.settings.public.startDate) : moment().isAfter(Meteor.settings.public.currentStudentDate)

      // get multipleTimeMode
      let multipleTimeMode = Meteor.settings.public.examChoice != undefined ? true : false

      // signup number

      if ( !signupNumberValid(examTime) ) {
        throw new Meteor.Error('505', `报名人数已满`);
      } else if (moment().isBefore(Meteor.settings.public.startDate) || moment().isAfter(Meteor.settings.public.expireDate)) {
        throw new Meteor.Error('504', `不在报名时间内，具体报名时间以服务器时间为准`);
      } else if (!validStartDate) {
        throw new Meteor.Error('503', `请检查学籍以及允许报名的时间`);
      } else if (multipleTimeMode && !examTime) {
        throw new Meteor.Error('502', `没有选择报名考试时间`);
      } else {
        // when everything checked out, signup student

        result = Student.update({
          _id: id
        }, {
          $set: {
            family_name: familyName,
            first_name: firstName,
            language: language,
            examTime: examTime
          }
        })

        if (result == 1) {
          let message = `${id} ${familyName} ${firstName} ${language}`
          console.log(`[SignupStudent Success] ${message}`)
          PromiseMeteorCall('pushChat', `SignupStudent Success`,`${message}`)
          .catch( err => console.log(err) )
          return `success`
        } else {
          console.log(`[SignupStudent Fail] ${message}`)
          // PromiseMeteorCall('pushChat', `SignupStudent Fail` , `${message}`)
          // .catch( err => console.log(err) )
          return `fail`
        }

      }
    }



  },
  adminSignupStudent: function(id, familyName, firstName, language) {

    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {

      // check signup criteria
      let studentStatus = Student.findOne({
        _id: id
      }).status

      validStartDate = (studentStatus == '毕业') ? moment().isAfter(Meteor.settings.public.startDate) : moment().isAfter(Meteor.settings.public.currentStudentDate)

      // when everything checked out, signup student

      result = Student.update({
        _id: id
      }, {
        $set: {
          family_name: familyName,
          first_name: firstName,
          language: language
        }
      })

      if (result == 1) {
        return `success`
      } else {
        return `fail`
      }


    } else {
      throw new Meteor.Error('500', 'No Premission');
    }

  }
});

signupNumberValid = (examTime) => {
  let examChoice = Meteor.settings.public.examChoice
  let signedCount = Student.find({ examTime: examTime, edited:true }).count()
  let currentIDindex = lodash.findIndex(examChoice, { 'id':parseInt(examTime) })

  return signedCount < examChoice[currentIDindex].limit
}
