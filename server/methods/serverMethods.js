Meteor.methods({
  studentCount: function() {

    studentCount = Student.find({edited: true}).count()
    serverTime = moment().unix()
    multipleTimeMode = Meteor.settings.public.examChoice != undefined ? true : false

    if ( multipleTimeMode ) {

      // return signed count for each date
      try {
        // date aggredate can't handle those signin with 0 at start
        // let dateCount = Promise.await(Student.rawCollection().aggregate([ { $match: { edited: true } }, {"$group" : {_id:"$examTime", count:{$sum:1}}} ]).toArray())

        // conventional methods to get signed count
        examTimes = Meteor.settings.public.examChoice
        dateCount = []
        _.forEach(examTimes, function(time) {
          let count = Student.find({ examTime:time.id.toString(), edited: true }).count()

          dateCount.push({ _id:time.id.toString(), count:count} )
        })

        return {studentCount:studentCount, serverTime: serverTime, multipleTimeMode:multipleTimeMode, dateCount:dateCount}

      } catch(e) {
          console.log(e)
      }

    } else {

      return {studentCount:studentCount, serverTime: serverTime, multipleTimeMode:multipleTimeMode}

    }
  }
});
