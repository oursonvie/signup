Meteor.methods({
  printExamID:function(certno){
     try {
       if ( Seats.find({certno: certno}).count() > 0 ) {
         SeatInfo = Seats.findOne({certno: certno})
         // console.log(SeatInfo)

         // check image, examroom info existance
         if ( Image.findOne({certificateno:certno}) &&  Image.findOne({certificateno:certno}).doccontent && Examroom.findOne({examroomId: SeatInfo.roomnumber}) && Examroom.findOne({examroomId: SeatInfo.roomnumber}).examroomLocation ) {

           StudentImage = Image.findOne({certificateno: certno})

           ExamroomInfo = Examroom.findOne({examroomId: SeatInfo.roomnumber})

           renderObject = {
             studentid: SeatInfo.studentid,
             name: SeatInfo.name,
             degree: SeatInfo.degree,
             level: SeatInfo.level,
             certno: SeatInfo.certno,
             examid: SeatInfo.examid,
             examtime: examDateTimeConverter(ExamroomInfo.starttime, ExamroomInfo.duration),
             subject: SeatInfo.language,
             examroom: SeatInfo.roomnumber,
             seatno: SeatInfo.seatnumber,
             location: ExamroomInfo.examroomLocation,
             examtype: '闭卷',
             place: '西安交通大学（东校区）',
             address: '西安市咸宁西路28号西安交通大学兴庆校区',
             image: base64ImageFixer(StudentImage.doccontent)
           }

           return makeExamId(renderObject)


         } else {
           new Meteor.Error('404', 'no matching image or examroom info')
         }

       } else {
         return new Meteor.Error('404', 'no matching student')
       }


     } catch(err) {
       return new Meteor.Error('400', err)
     }
  }
});
