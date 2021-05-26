Meteor.methods({
  getPhoto:function(certno) {
    try {
      let student = Student.findOne({certno:certno})
      if (student.source == 'xjtu') {
        return getXjtuPhoto(student.signupid)
      } else if (student.source == 'open') {
        // change batchcode
        if (student.batchcode.toString().length == 8) {
          return getOpenPhoto(parseInt(student.batchcode.toString().slice(2,6)), certno)
        } else {
          return getOpenPhoto(student.batchcode, certno)
        }

      } else {
        throw new Meteor.Error( '503', 'Data missing source' );
      }
    } catch(err) {
      throw new Meteor.Error(err.error, err.message)
    }

  },
  addPhoto: function(certno, studentPhoto) {
    console.log(`[certno: ${certno}]`)

    studentPhoto.createdby = this.userId
    studentPhoto.updated = moment().format('YYYY-MM-DD HH:mm:ss')

    let result = Image.upsert({certificateno:certno},{$set:studentPhoto})
    return result
  }

});
