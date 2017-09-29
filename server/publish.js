Meteor.publish('StudentOne', function(id) {
  if (id != false) {
    console.log(id)
  }
  return Test.find({certno:id})
})

Meteor.publish('regiesteredStudents', function() {
  return Test.find({edited:true})
})
