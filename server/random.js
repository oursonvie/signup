Meteor.methods({
  randomlizeExamroom: function() {
    // if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {

      let totalExamPeople = []

      _.forEach(LanguageList(), function(lang) {
        let count = Student.find({edited:true, language: lang.value}).count()
        if (count > 0) {
          totalExamPeople.push({name: lang.value, count: count})
        }
      })
      // list exam by signup people count
      totalExamPeople = lodash.orderBy(totalExamPeople, ['count'], ['desc']);

      console.log(totalExamPeople)

      // loop though each exam language
      _.forEach(totalExamPeople, function(exam) {
        // get all student ids under same examnation
        rawList = Student.find({edited:true, language: exam.name },{fields:{_id:1}}).fetch()

        console.log(rawList)

        sortedList = []

        // put student into random order
        n = rawList.length
      	for ( i = 0; i < n - 1; i++) {
      		sortedList.push(rawList.splice(Math.floor(Math.random()*rawList.length),1)[0]._id)
      	}
        sortedList.push(rawList[0]._id)

        console.log(sortedList)

        // get all unoccupied examroom
        examrooms = Examroom.find({occupied: false},{fields: {examroomId:1, capacity:1}}).fetch()

        console.log(examrooms)

        // loop through examrooms to add student alone with seat info
        for ( roomNumber = 1; roomNumber<examrooms.length + 1; roomNumber++) {
          // update this room to occupied status
          Examroom.update({examroomId:roomNumber},{$set:{occupied:true}});

          for ( seatNumber = 1; seatNumber < examrooms[roomNumber-1].capacity + 1 && sortedList.length > 0; seatNumber++) {

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
        }

      })

      /*

      if (Examroom.find().count() > 0) {
        rawList = Student.find({edited:true},{fields:{_id:1}}).fetch()
        sortedList = []
        // random array
        n = rawList.length
      	for ( i = 0; i < n - 1; i++) {
      		sortedList.push(rawList.splice(Math.floor(Math.random()*rawList.length),1)[0]._id)
      	}
        sortedList.push(rawList[0]._id)

        // test if class room fits students
        // get total examroom capacity
        let totalSeats = Examroom.aggregate([
           {
             $group: {
               _id: {},
               totalSeats: { $sum: "$capacity"},
             }
           }
        ])[0].totalSeats

        console.log(sortedList.length, totalSeats)

        if ( totalSeats >= sortedList.length) {
          // console.log('enough examrooms')
          // start adding student into examrooms

          examrooms = Examroom.find({},{fields: {examroomId:1, capacity:1}}).fetch()

          // loop for each room, each room loop till capacity reaches
          // splice the first object from array, put in DB
          for ( roomNumber = 1; roomNumber<examrooms.length + 1; roomNumber++) {
          	for ( seatNumber = 1; seatNumber < examrooms[roomNumber-1].capacity + 1 && sortedList.length > 0; seatNumber++) {

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

               console.log(result)

              Seats.insert(seatInfo)


          	}
          }

          return ['401', 'Not enough examrooms']

        } else {
          throw new Meteor.Error( '401', 'Not enough examrooms' );
        }

      } else {
        throw new Meteor.Error( '401', 'No examrooms added' );
      }

    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }

    */

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
