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
          console.log(result)
        } catch(err) {
          console.log(student)
          console.log(err)
        }

      })

      a = `[studentImport] done`

      console.log(a)
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

    if (Image.findOne({certificateno:certno})) {
      result = Image.update({certificateno:certno},{$set:studentPhoto})
      return result
    } else {
      result = Image.insert(studentPhoto)
      return result
    }

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
