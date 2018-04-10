examRoomGenerator = () => {
  let languageList = []

  // language array
  _.forEach(LanguageList(), function(language){
    languageList.push(language.value)
  })

  let languageCount = []
  // count examroom needed for each languages
  _.forEach(languageList, function(language){
    let count = Student.find({language:language}).count()
    let examroomNeeded = Math.ceil(count/30)
    languageCount.push(examroomNeeded)
  })

  let sum = languageCount.reduce((a, b) => a + b, 0);

  return sum

}

Meteor.methods({
  randomlizeExamroom: function() {
    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {

      // check examroom before generating

      if (Examroom.find().count() == 0) {

        // generate examroom
        const examroomNeeded = examRoomGenerator()

        for (i = 1; i < examroomNeeded + 1; i++) {
          // define examroom init data, includes exam time
          let room = {
            examroomId: i,
            capacity: 30,
            starttime: Meteor.settings.private.exam_starttime,
            duration: Meteor.settings.private.exam_duration
          }
          Examroom.insert(room)
        }


        // start assigning people into examroom
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
        throw new Meteor.Error( '403', 'Clear examroom before running random function' );
      }

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
