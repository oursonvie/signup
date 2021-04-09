Meteor.methods({
  studentCount: function() {

    studentCount = Student.find({edited: true}).count()
    serverTime = moment().unix()
    multipleTimeMode = Meteor.settings.public.examChoice != undefined ? true : false

    

    return {studentCount:studentCount, serverTime: serverTime, multipleTimeMode:multipleTimeMode}
  }
});
