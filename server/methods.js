Meteor.methods({
  insertTest:function(Obj){
     Test.insert(Obj)
  },
  importStudent:function(papaData){
    console.log(papaData.length)

    _.forEach(papaData, function(student) {
      console.log(student)
      Test.insert(student)
    })

  },
  findStudent:function(userId){
    if (Test.findOne({certno:userId})) {
      let result = Test.findOne({certno:userId})
      return result
    } else {
      throw new Meteor.Error('Error', 'Student not found');
    }
  }
});
