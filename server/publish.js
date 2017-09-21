Meteor.publish('StudentOne', function(id) {
  console.log(id)
  return Test.find({certno:id})
})

Meteor.publish('regiesteredStudents', function() {
  return Test.find({edited:true})
})
