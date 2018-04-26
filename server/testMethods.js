Meteor.methods({
  randomAssignStudent: function(number) {
    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {
      let arrayList = []
      _.forEach(LanguageList(), function(list) {
        arrayList.push(list.value)
      })

      let fullStudentList = Student.find({edited:false}).fetch()

        // random language
        /*
        for(i=0; i < number; i++) {
          let student = fullStudentList[i]
          let result = Student.update({_id: student._id}, {$set:{
            first_name: 'asd',
            family_name: 'bbb',
            language: arrayList[Math.ceil(Math.random() * arrayList.length - 1)]
          }})
        }
        */

        // English Only
        for(i=0; i < number; i++) {
          let student = fullStudentList[i]
          let result = Student.update({_id: student._id}, {$set:{
            first_name: 'asd',
            family_name: 'bbb',
            language: arrayList[0]
          }})
        }
    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }


  },
  checkPhoto: function() {

    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {
      console.log('start checking pictures')

      let checkArray = Student.find({edited:true}, {fields:{_id:0, certno:1}}).fetch()

      _.forEach(checkArray, function(student) {
        let certno = student.certno


        // if image missing, get them
        if (Image.find({certificateno:certno}).count() == 0) {
          PromiseMeteorCall('getPhoto', certno)
          .then(res => {
            PromiseMeteorCall('addPhoto', certno, res)
            .then(res => console.log(res))
            .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
        }

      })
      console.log('[Check Photo] Done')
    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }
  }
})
