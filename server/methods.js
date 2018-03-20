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
  }
});
