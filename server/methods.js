Meteor.methods({
  insertTest:function(Obj){
     Test.insert(Obj)
  },
  importStudent:function(papaData){
    console.log(papaData.length)

    _.forEach(papaData, function(student) {
      Test.insert(student)
    })

  },
  download:function(){
    return CSV.unparse(Test.find({edited:true}, {fields:{createdBy:0}}).fetch())
  },
  insertToBackup:function(doc){
    Backup.insert(doc)
  },
  countBackup:function() {
    return Backup.find().count()
  }
});
