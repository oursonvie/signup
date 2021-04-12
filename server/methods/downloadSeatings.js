Meteor.methods({
  downloadSeats:function() {

    // clean seatDownload db
    console.log('[downloadSeats] cleaning SeatDownload')
    SeatDownload.remove({})

    seats = Seats.find({},{fields:{_id:0, studentid:1, roomnumber:1, lcenter:1, seatnumber: 1, name: 1, certno: 1, examid: 1, source: 1, language: 1, examTime:1}}).fetch()

    // insert eversingle one student with room name into db

    _.forEach(seats, function(seat) {

      seatInfo = seat
      examRoomInfo = Examroom.findOne({examroomId:seat.roomnumber},{fields:{address:1, examroomLocation:1, place:1, _id:0}})

      combined = {...seatInfo, ...examRoomInfo}

      SeatDownload.insert(combined)

    })

    console.log(`[downloadSeats] studentDataReady`)


    return CSV.unparse(SeatDownload.find({},{fields:{_id:0}}).fetch())
  }
});
