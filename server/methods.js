Meteor.methods({
  insertStudent:function(Obj){
     Student.insert(Obj)
  },
  importStudent:function(papaData){
    console.log(papaData.length)
    _.forEach(papaData, function(student) {
      Student.insert(student)
    })

  },
  download:function(){
    return CSV.unparse(Student.find({edited:true}, {fields:{createdBy:0, edited:0}}).fetch())
  },
  importExamroom:function(papaData, datetime){
    // console.log(papaData.length)

    _.forEach(papaData, function(examroom) {
      examroom.starttime = datetime.starttime
      examroom.duration = datetime.duration
      Examroom.insert(examroom)
    })
  },
  getPhoto:function(certno) {
    try {
      let student = Student.findOne({certno:certno})
      if (student.source == 'xjtu') {
        return getXjtuPhoto(student.signupid)
      } else if (student.source == 'open') {
        return getOpenPhoto(student.batchcode, certno)
      } else {
        throw new Meteor.Error( '503', 'Data missing source' );
      }
    } catch(err) {
      throw new Meteor.Error('404', 'Cannot find student')
    }

  },
  addPhoto: function(certno, studentPhoto) {
    studentPhoto.createdby = this.userId
    studentPhoto.updated = moment().format('YYYY-MM-DD HH:mm:ss')

    if (Image.findOne({certificateno:certno})) {
      result = Image.update({certificateno:certno},{$set:studentPhoto})
      return result
    } else {
      result = Image.insert(studentPhoto)
      return result
    }

  }
});
