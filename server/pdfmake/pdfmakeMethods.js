Meteor.methods({
  printExamID:function(certno){

     if ( Seats.find({certno: certno}).count() > 0 ) {
       SeatInfo = Seats.findOne({certno: certno})
       // console.log(SeatInfo)

       // check image, examroom info existance
       if ( Image.findOne({certificateno:certno}) &&  Image.findOne({certificateno:certno}).doccontent && Examroom.findOne({examroomId: SeatInfo.roomnumber}) && Examroom.findOne({examroomId: SeatInfo.roomnumber}).examroomLocation ) {

         StudentImage = Image.findOne({certificateno: certno})

         ExamroomInfo = Examroom.findOne({examroomId: SeatInfo.roomnumber})

         // reading exam datetime infor directly from setting file
         ExamDateInfo = Meteor.settings.public.examtime

         renderObject = {
           studentid: SeatInfo.studentid,
           name: SeatInfo.name,
           degree: SeatInfo.degree,
           level: SeatInfo.level,
           certno: SeatInfo.certno,
           examid: SeatInfo.examid,
           examtime: examDateTimeConverter(ExamDateInfo.starttime, ExamDateInfo.duration),
           subject: SeatInfo.language,
           examroom: SeatInfo.roomnumber.toString().padStart(3, '0'),
           seatno: SeatInfo.seatnumber.toString().padStart(2, '0'),
           location: ExamroomInfo.examroomLocation,
           examtype: '闭卷',
           place: ExamroomInfo.place,
           address: ExamroomInfo.address,
           image: base64ImageFixer(StudentImage.doccontent)
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
