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
    return CSV.unparse(Student.find({edited:true}, {fields:{createdBy:0}}).fetch())
  },
  importExamroom:function(papaData){
    // remove old data before add new
    Examroom.remove({})
    console.log(papaData.length)
    _.forEach(papaData, function(examroom) {
      Examroom.insert(examroom)
    })
  },
  getPhoto:function(certno) {
    let student = Student.findOne({certno:certno})
    if (student.source == 'xjtu') {
      return getXjtuPhoto(student.signupid)
    } else if (student.source == 'open') {
      return getOpenPhoto(student.batchcode, certno)
    } else {
      throw new Meteor.Error( '503', 'Data missing source' );
    }

  },
  addOpenPhoto: function(certno, photoData) {
    let dataList = photoData.data.dataList
    _.forEach(dataList, function(photo) {
      if (certno.toUpperCase() == photo.certificateno.toUpperCase()) {
        photo.source = 'open'
        Image.insert(photo)
      } else {
        console.log(photo)
      }
    })

    return 'photo added'

  }
});
