Meteor.methods({
  randomlizeExamroom: function() {
    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {
      let totalExamPeople = []

      _.forEach(LanguageList(), function(lang) {
        let count = Student.find({edited:true, language: lang.value}).count()
        if (count > 0) {
          totalExamPeople.push({name: lang.value, count: count})
        }
      })

      // list exam by signup people count
      totalExamPeople = lodash.orderBy(totalExamPeople, ['count'], ['desc']);

      // define total examroom number
      const totalExamRoom = Examroom.find({},{sort:{examroomId:1}}).fetch()
      const TotalExamRoomCount = totalExamRoom.length

      // loop though each exam language
      _.forEach(totalExamPeople, function(exam) {

        // get all student ids under same examnation
        let rawList = Student.find({edited:true, language: exam.name },{fields:{_id:1}}).fetch()

        let sortedList = []

        // put student into random order
        n = rawList.length
      	for ( i = 0; i < n - 1; i++) {
      		sortedList.push(rawList.splice(Math.floor(Math.random()*rawList.length),1)[0]._id)
      	}
        sortedList.push(rawList[0]._id)

        // get all unoccupied examroom
        let examrooms = Examroom.find({occupied: false},{fields: {examroomId:1, capacity:1}, sort:{examroomId:1}}).fetch()

        let startingRoom = examrooms[0].examroomId

        // loop through examrooms to add student alone with seat info
        for ( roomNumber = startingRoom; roomNumber < TotalExamRoomCount + 1; roomNumber++) {

          if (sortedList.length > 0) {

            // console.log(`startingRoom: ${startingRoom}, roomNumber < ${totalExamRoom + 1}`)

            for ( seatNumber = 1; seatNumber < totalExamRoom[roomNumber-1].capacity + 1 && sortedList.length > 0; seatNumber++) {

                // first seat occupied in a room indicate the room is occupied
                if (seatNumber == 1) {
                  // update this room to occupied status
                  Examroom.update({examroomId:roomNumber},{$set:{occupied:true, language: exam.name}});
                }

                let studentId = sortedList.splice(0,1)[0]

                student = Student.findOne({_id:studentId})
                examID = moment().format('YY') + '1' + '10698' + roomNumber.toString().padStart(3, '0') + seatNumber.toString().padStart(2, '0')

                seatInfo = {
                  meteorId: studentId,
                  studentid: student.studentid,
                  roomnumber: roomNumber,
                  seatnumber: seatNumber,
                  name: student.name,
                  degree: student.degree,
                  level: student.level,
                  certno: student.certno,
                  examid: examID,
                  lcenter: student.lcenter,
                  source: student.source,
                  language: student.language
                }

                briefSeats = {
                  seatnumber: seatNumber,
                  meteorId: studentId,
                  name: student.name
                }

                // add seat infor into examroom, restrict from collection setting
                 result = Examroom.update({examroomId:roomNumber},{$addToSet:{seats:briefSeats}});


                Seats.insert(seatInfo)

            }

          } else {
            console.log(`stopped assigning ${exam.name} at roomNumber: ${roomNumber}, seatNumber: ${seatNumber}`);
            break;
          }


        }

      })

    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }

  },
  cleanExamroom: function() {
    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {
      console.log('cleaning')
      try {
        Examroom.remove({})
        Seats.remove({})
        return `examroom: ${Examroom.find().count()}, Seats: ${Seats.find().count()}`
      } catch(err) {
        throw new Meteor.Error('error', err)
      }
    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }



  }
});
