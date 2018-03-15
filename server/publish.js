Meteor.publish('StudentOne', function(id) {
  if (id != false) {
    console.log(id)
  }
  return Student.find({certno:id})
})

Meteor.publish('regiesteredStudents', function() {
  return Student.find({edited:true})
})
