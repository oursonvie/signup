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
    return CSV.unparse(Test.find({edited:{'$exists':false}}, {fields:{createdBy:0}}).fetch())
  }
});
