Meteor.methods({
  studentCount: function() {

    studentCount = Student.find({edited: true}).count()
    serverTime = moment().unix()

    return {studentCount:studentCount, serverTime: serverTime}
  }
});
