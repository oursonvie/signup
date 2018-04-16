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
  downloadStudentViaLanguage:function(lang){
    return CSV.unparse(Student.find({edited:true, language: lang}, {fields:{createdBy:0, edited:0}}).fetch())
  },
  downloadExamRoom:function(){
    return CSV.unparse(Examroom.find({},{fields:{_id:0, examroomId:1, examroomLocation:1}}).fetch())
  },
  downloadSeats:function(){
    return CSV.unparse(Seats.find({},{fields:{_id:0, studentid:1, roomnumber:1, seatnumber: 1, name: 1, certno: 1, examid: 1, source: 1, language: 1}}).fetch())
  },
  importExamroom:function(papaData){
    //console.log(papaData)
    _.forEach(papaData, function(examroom) {
      try {
        let examroomID = parseInt(examroom.examroomId)
        Examroom.update({examroomId: examroomID}, {$set:{examroomLocation: examroom.examroomLocation}})
      } catch(err) {
        throw new Meteor.Error('500', err)
      }

     })
  },
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
      throw new Meteor.Error('404', 'Cannot find student')
    }

  },
  addPhoto: function(certno, studentPhoto) {
    console.log(`[certno: ${certno}]`)

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
