Meteor.methods({
  printExamID: function(certno) {

    if ( Seats.find( {certno: certno} ).count() > 0) {
      let SeatInfo = Seats.findOne({certno: certno})
      // console.log(SeatInfo)

      let targetImage = Image.findOne({certificateno: certno})
      let ExamroomInfo = Examroom.findOne({examroomId: SeatInfo.roomnumber})

      // check image, examroom info existance
      if (targetImage && targetImage.doccontent && ExamroomInfo && ExamroomInfo.examroomLocation) {

        // reading exam datetime infor directly from setting file
        let ExamDateInfo = Meteor.settings.public.examtime

        renderObject = {
          studentid: SeatInfo.studentid,
          name: SeatInfo.name,
          degree: SeatInfo.degree,
          level: (SeatInfo.level) ? SeatInfo.level : '毕业生',
          certno: SeatInfo.certno,
          examid: SeatInfo.examid,
          examtime: examDateTimeConverter(SeatInfo.examTime, ExamDateInfo.duration),
          subject: SeatInfo.language,
          examroom: SeatInfo.roomnumber.toString().padStart(3, '0'),
          seatno: SeatInfo.seatnumber.toString().padStart(2, '0'),
          location: ExamroomInfo.examroomLocation,
          examtype: '闭卷',
          place: ExamroomInfo.place,
          address: ExamroomInfo.address,
          image: base64ImageFixer(targetImage.doccontent)
        }

        return makeExamId(renderObject)


      } else {
        throw new Meteor.Error('404', 'no matching image or examroom info')
      }

    } else {
      throw new Meteor.Error('404', 'no matching student')
    }

  }
});
