Meteor.methods({
  randomAssignStudent: function(number) {
    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {
      let arrayList = arrayConvter( LanguageList(), 'value')

      let rawList = Meteor.settings.public.examChoice
      let idList = arrayConvter( rawList, 'id')

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
            language: arrayList[ Math.ceil(Math.random()*arrayList.length) - 1 ],
            examTime: parseInt(idList[ Math.ceil(Math.random()*idList.length) - 1])
          }})
        }
    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }


  },
  checkPhoto: function() {

    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {
      console.log('start checking pictures')

      // remove empty photo entity
      let fileexist = Image.remove({fileexist:false})

      console.log(`${fileexist} empty students removed from image DB`)

      let checkArray = Student.find({edited:true}, {fields:{_id:0, certno:1}}).fetch()

      _.forEach(checkArray, function(student) {
        let certno = student.certno

        // if image missing, get them
        if (Image.find({certificateno:certno}).count() == 0) {
          PromiseMeteorCall('getPhoto', certno)
          .then(res => {
            PromiseMeteorCall('addPhoto', certno, res)
            .then(res => console.log(res))
            .catch(err => console.log( JSON.stringify(err) ))
          })
          .catch(err => console.log(err))
        }

      })
      return '[Check Photo] Done'
    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }
  }
})
