Meteor.methods({
  insertStudent:function(Obj){
     Student.insert(Obj)
  },
  importStudent:function(papaData) {
    console.log(`[studentImport]: ${papaData.length}`)

    if ( this.userId && Roles.userIsInRole(this.userId, ['admin']) ) {
      _.forEach(papaData, function(student) {
        try {
          result = Student.upsert(
            {
              signupid: student.signupid ,
              certno: student.certno ,
              studentid: student.studentid
            },
            {$set:student}
          )

          if ( result.insertedId == undefined ) {
            console.log(student)
          }
          // console.log(result)
        } catch(err) {
          console.log(student)
          console.log(err)
        }

      })

      a = `[studentImport] done`

      return a
    } else {
      throw new Meteor.Error('500', 'No Premission');
    }


  },
  download:function(){
    return CSV.unparse(Student.find({edited:true}, {fields:{createdBy:0, edited:0}}).fetch())
  },
  downloadId: function() {
    return CSV.unparse(Student.find({}, {fields:{_id:1}}).fetch())
  },
  downloadStudentViaLanguage:function(lang){
    return CSV.unparse(Student.find({edited:true, language: lang}, {fields:{createdBy:0, edited:0}}).fetch())
  },
  downloadExamRoom:function(){
    return CSV.unparse(Examroom.find({},{fields:{_id:0, examroomId:1, examroomLocation:1}}).fetch())
  },
  importExamroom:function(papaData){
    //console.log(papaData)
    _.forEach(papaData, function(examroom) {
      try {
        let examroomID = parseInt(examroom.examroomId)
        console.log(examroom)
        Examroom.update({examroomId: examroomID}, {$set:
          {
            examroomLocation: examroom.examroomLocation,
            place: examroom.place,
            address: examroom.address
          }
      })
      } catch(err) {
        throw new Meteor.Error('500', err)
      }

     })
  },
  insertFaceLog: function(log) {
    return FaceLogs.insert(log)
  },
  certnoPhotoLookUp: function(certno) {
    if ( Image.findOne({certificateno:certno}) && Image.findOne({certificateno:certno}).doccontent ) {
      image = Image.findOne({certificateno:certno}).doccontent
      return base64ImageFixer(image)
    } else {
      throw new Meteor.Error(`cant find pic`, 'cannot find student picture')
    }
  },
  certnoStudentIdLoopUp: function(certno) {
    if ( Student.findOne({certno: certno}) ) {
      return Student.findOne({certno: certno}).studentid
    } else {
      throw new Meteor.Error(`cant find student`, 'cannot find student')
    }
  }
});
