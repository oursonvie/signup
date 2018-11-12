Meteor.methods({
  generateExamroomList:function(examroomId){

    // console.log(examroomId)

    let examroom = Examroom.findOne({examroomId:examroomId})

    let arrayStudent = Seats.find({roomnumber:examroomId}).fetch()

    var docPDF = {
      pageSize: 'A4',

      content: [
        { text: `西安交通大学网络教育学院2018全国学位外语考试考场签到单`, alignment: 'center' },
        { text: `考场 ${examroom.examroomId}`, alignment: 'left', fontSize: 8 },
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            widths: [ '*', '*', '*', '*', '*'],

            body: arrayConverter(arrayStudent)
          },
          layout: 'noBorders'
        }
      ]
    }

    return docPDF
  }
});

chunkArray = function(array, size) {
  let result = []
  // actually chunking
  while (array.length > 0) result.push(array.splice(0,size));
  return result
}

singleStudent = function(student) {

  let studentImage = base64ImageFixer(Image.findOne({certificateno: student.certno}).doccontent)

  console.log(studentImage.length)

  console.log(student.certno)

  console.log(studentImage.slice(0,40))

  return [
    {
        image: studentImage,
        fit: [65, 65],
        alignment: 'center'
    },
    {text: '姓名: ' + student.name + ' 座位: ' + student.seatnumber + '\n', fontSize: 8},
    {text: '身份证号: ' + student.certno + '\n', fontSize: 8},
    {text: '准考证号: ' + student.examid + '\n', fontSize: 8},

  ]
}

arrayConverter = function(students) {

  rowOfStudents = []

  lodash.each(students, function(student) {

    rowOfStudents.push(singleStudent(student))
  })

  // chunk the result directly
  let result = chunkArray(rowOfStudents, 5)

  return result

}
