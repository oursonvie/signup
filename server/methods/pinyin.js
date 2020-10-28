var pinyin = require("chinese-to-pinyin")

let regex = /^[A-Za-z]+$/

checkPinyin = () => {
  let list = Student.find({edited:true},{fields:{family_name:1, first_name:1}}).fetch()

  _.forEach(list, function(student) {

    // check family name
    family_name = ( regex.test(student.family_name) ) ? student.family_name : capitalizeFirstLetter(pinyin( student.family_name, {removeTone: true, removeSpace: true} ))

    // check first name
    first_name = ( regex.test(student.first_name) ) ? student.first_name : capitalizeFirstLetter(pinyin(student.first_name, {removeTone: true, removeSpace: true}))

    result = Student.update( {_id:student._id}, {$set:{family_name:family_name, first_name:first_name}} )

    console.log(`[checkPinyin], updating ${student._id}`)

  })

}

capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Meteor.methods({
  checkPinyin: function() {
    if ( Roles.userIsInRole(this.userId, ['superadmin']) ) {

      checkPinyin()

    } else {
      throw new Meteor.Error( '500', 'No Premission' );
    }

  }
});
