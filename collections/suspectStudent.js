SuspectStudents = new Mongo.Collection("suspectstudents");

SuspectStudents.deny({
  insert: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});

SuspectStudents.allow({
  update: function(){
    return true
  }
})
