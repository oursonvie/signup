Meteor.methods({
  updateStudentStatus: function(papaData) {
    console.log(papaData.length)
    _.forEach(papaData, function(student) {
      result = Student.update(
        {
          signupid:student.signupid,
          certno: student.certno,
          studentid: student.studentid,
        },
        {
          $set: {
            status: student.status
          }
        }
      )

      console.log(result)
    })
  },
  updateStudentLevel: function(papaData) {
    console.log(papaData.length)
    _.forEach(papaData, function(student) {

      // console.log(student)

      // check if level exists

      targetStudent = Student.findOne({certno:student.certno})

      if ( targetStudent ) {

        if ( !targetStudent.level ) {

          result = Student.update(
            {
              certno:student.certno
            },
            {
              $set: {
                level: student.level
              }
            }
          )

          console.log(`[LevelUpdate] ${student.certno} result: ${result}`)
        }



      } else {
        console.log(`[LevelUpdate] ${student.certno} not in db`)
      }


    })
  },
});
