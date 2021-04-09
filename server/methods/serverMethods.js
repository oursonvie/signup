Meteor.methods({
  studentCount: function() {

    studentCount = Student.find({edited: true}).count()
    serverTime = moment().unix()
    multipleTimeMode = Meteor.settings.public.examChoice != undefined ? true : false

    if ( multipleTimeMode ) {

      // return signed count for each date
      try {
        let dateCount = Promise.await(Student.rawCollection().aggregate([ { $match: { edited: true } }, {"$group" : {_id:"$examTime", count:{$sum:1}}} ]).toArray())

        return {studentCount:studentCount, serverTime: serverTime, multipleTimeMode:multipleTimeMode, dateCount:dateCount}

      } catch(e) {
          console.log(e)
      }

    } else {

      return {studentCount:studentCount, serverTime: serverTime, multipleTimeMode:multipleTimeMode}

    }
  }
});
