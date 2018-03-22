Meteor.publish('StudentOne', function(id) {
  if (id != false) {
    console.log(id)
  }
  return Student.find({certno:id})
})

Meteor.publish('regiesteredStudents', function() {
  if (this.userId) {
    return Student.find({edited:true})
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }

})

Meteor.publish('examrooms', function() {
  if (this.userId) {
    return Examroom.find()
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }
})

Meteor.publish('examroomsOne', function(id) {
  if (this.userId) {

    let rawList = Examroom.findOne({_id:id}).seats

    let studentArray = []
    _.forEach(rawList, function(student) {
      studentArray.push(student.studentId)
    })

    return [
      Examroom.find({_id:id}),
      Student.find({_id:{$in:studentArray}})
    ]
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }
})
