Meteor.methods({
  insertTest:function(Obj){
     Test.insert(Obj)
  },
  importStudent:function(papaData){
    console.log(papaData.length)

    _.forEach(papaData, function(student) {
      Test.insert(student)
    })

  }
});
