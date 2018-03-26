Image = new Mongo.Collection("image");

Image.deny({
  insert: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});

Image.allow({
  update: function(){
    return true
  }
})
