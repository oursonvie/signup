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
  }
});
