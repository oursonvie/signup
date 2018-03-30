Meteor.methods({
  generateExamroomList:function(examroomId){

    console.log(examroomId)

    let examroom = Examroom.findOne({examroomId:examroomId})

    let arrayStudent = Seats.find({roomnumber:examroomId}).fetch()

    var docPDF = {
      pageSize: 'A4',

      header: {
        columns: [
          { text: `批次编号: 123 考点编号: 10698 考场号：${examroom.examroomId}`, alignment: 'center' }
        ]
      },

      content: [
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


  return [
    {
        image: studentImage,
        fit: [100, 80],
        alignment: 'center'
    },
    {text: '姓名: ' + student.name + ' \n', fontSize: 10},
    {text: '座位: ' + student.seatnumber + '\n', fontSize: 10},
    {text: student.certno + '\n', fontSize: 8},

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
