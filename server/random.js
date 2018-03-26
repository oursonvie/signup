Meteor.methods({
  randomlizeExamroom: function() {
    if (Examroom.find().count() > 0) {
      rawList = Student.find({edited:true},{fields:{_id:1}}).fetch()
      sortedList = []
      // random array
      n = rawList.length
    	for ( i = 0; i < n - 1; i++) {
    		sortedList.push(rawList.splice(Math.floor(Math.random()*rawList.length),1)[0]._id)
    	}
      sortedList.push(rawList[0]._id)

      /*

      // devide into group of 30
      let arrays = [], size = 30;

      while (sortedList.length > 0)
        arrays.push(sortedList.splice(0, size));

      */


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

        		// console.log(roomNumber, seatNumber, studentId)

            seatInfo = {seatNumber: seatNumber, studentId: studentId}

            // console.log(roomNumber, seatNumber, examrooms[roomNumber-1].capacity + 1, sortedList.length)

            // need following info for student

            /*
            studentId =
            name =
            degree =
            level =
            certno =
            examID =
            */


            // add seat infor into examroom
            Examroom.update({examroomId:roomNumber},{$addToSet:{seats:seatInfo}});


        	}
        }

        return ['401', 'Not enough examrooms']

      } else {
        throw new Meteor.Error( '401', 'Not enough examrooms' );
      }

    } else {
      throw new Meteor.Error( '401', 'No examrooms added' );
    }


  }
});
