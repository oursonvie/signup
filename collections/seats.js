Seats = new Mongo.Collection("seats");

Seats.deny({
  insert: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});

Seats.allow({
  update: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
})
