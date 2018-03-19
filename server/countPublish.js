Meteor.publish('studentCount', function() {
  Counts.publish(this,'studentCount', Student.find({edited:true}))
})
