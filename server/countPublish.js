Meteor.publish('studentCount', function() {
  Counts.publish(this,'studentCount', Student.find({edited:true}))
})

Meteor.publish('photoCount', function() {
  Counts.publish(this,'photoCount', Image.find())
})
