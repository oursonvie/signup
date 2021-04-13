Meteor.methods({
  generateExamroomList:function(examroomId){

    // console.log(examroomId)

    examroomId = parseInt(examroomId)

    let examroom = Examroom.findOne({examroomId:examroomId})

    let arrayStudent = Seats.find({roomnumber:examroomId}).fetch()

    let seatInfo = Seats.findOne({roomnumber:examroomId})

    var docPDF = {
      pageSize: 'A4',

      content: [
        { text: `${Meteor.settings.public.signupSheetName}`, alignment: 'center' },
        { text: `考场: ${examroom.examroomId} 考试时间: ${seatInfo.examTime} 考试语言: ${seatInfo.language}`, alignment: 'left', fontSize: 8 },
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
    studentImage = getImgUrl(`${Meteor.absoluteUrl()}img/blank.png`)
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
