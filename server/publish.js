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

Meteor.publish('examroomsOne', function(examroomId) {
  if (this.userId) {
    return Examroom.find({examroomId:examroomId})
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }
})

Meteor.publish('seatsStudentExamroom', function(examroomId) {
  if (this.userId) {
    return Seats.find({roomnumber:examroomId})
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }
})
