Meteor.methods({
  randomAssignStudent: function(number) {
    let arrayList = []
    _.forEach(LanguageList(), function(list) {
      arrayList.push(list.value)
    })

    let fullStudentList = Student.find({edited:false}).fetch()

      for(i=0; i < number; i++) {
        let student = fullStudentList[i]
        let result = Student.update({_id: student._id}, {$set:{
          first_name: 'asd',
          family_name: 'bbb',
          language: arrayList[Math.ceil(Math.random() * arrayList.length - 1)]
        }})
      }




  }
})
