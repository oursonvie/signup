Meteor.methods({
  generateExamroomList:function(examroomId){

    // console.log(examroomId)

    let examroom = Examroom.findOne({examroomId:examroomId})

    let arrayStudent = Seats.find({roomnumber:examroomId}).fetch()

    var docPDF = {
      pageSize: 'A4',

      content: [
        { text: `西安交通大学网络学院2019上半年全国学位外语考试考场签到表`, alignment: 'center' },
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
  while (array.length > 0) {
    result.push(array.splice(0,size));
  }

  return result
}

singleStudent = function(student) {
  studentImage = ''

  if ( Image.findOne({certificateno: student.certno}) != null && Image.findOne({certificateno: student.certno}).doccontent) {
    studentImage = base64ImageFixer(Image.findOne({certificateno: student.certno}).doccontent)
  } else {
    studentImage = blank()
  }

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

  // generate student array object
  lodash.each(students, function(student) {
    rowOfStudents.push(singleStudent(student))
  })

  // make sure the students array object are in the number of 5
  // get missing number
  missingStudents = 30 - rowOfStudents.length

  for(missingNumber = 0;missingNumber<missingStudents; missingNumber++) {
    rowOfStudents.push({})
  }

  // chunk the result directly
  let result = chunkArray(rowOfStudents, 5)

  // console.log(result)

  return result

}
