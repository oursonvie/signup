Meteor.publish('StudentOne', function(id) {
  console.log(id)
  return Test.find({certno:id})
})
