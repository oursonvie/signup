Meteor.publish('StudentOne', function(id) {
  if ( Student.findOne({certno:id}).status == '毕业' ) {
    return Student.find({certno:id})
  } else {
    return Student.find({certno:1})
  }
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

Meteor.publish('examCert', function(candidateId) {
  try {
    Seat = Seats.findOne({certno:candidateId})
    return [
      Seats.find({certno:candidateId}),
      Image.find({certificateno:candidateId}),
      Examroom.find({examroomId:Seat.roomnumber})
    ]
  } catch(err) {
    throw new Meteor.Error( '400', err )
  }

})

Meteor.publish('studentPhoto', function(id) {
  if (this.userId) {
    return Image.find({certificateno:id})
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }
})

Meteor.publish('suspectStudent', function(id) {
  if (this.userId) {
    return SuspectStudents.find({certno:id})
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }
})

Meteor.publish('onSitePic', function(id) {
  if (this.userId) {
    return Images.find({_id:id})
  } else {
    throw new Meteor.Error( '500', 'No Premission' );
  }
})
