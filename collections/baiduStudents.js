BaiduStudents = new Mongo.Collection("baidustudent");

BaiduStudents.deny({
  insert: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});

BaiduStudents.allow({
  update: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
})
