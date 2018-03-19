import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Examroom = new Mongo.Collection("examroom");

Examroom.deny({
  insert: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});

Examroom.allow({
  update: function(){
    return true
  }
})


Examroom.attachSchema(new SimpleSchema({
  examroomId: {
    type: Number,
    label: "考场号",
  },
  examroomLocation: {
    type: String,
    label: "考场类型",
  },
  createdBy: {
    type: String,
    autoValue:function(){
      if (this.isInsert) {
        return this.userId
      }
     },
     autoform: {
       type: 'hidden'
     }
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date
      }
    },
     autoform: {
       type: 'hidden'
     }
  },
  updateAt: {
    type: Date,
    autoValue: function() {
        return new Date
    },
    autoform: {
       type: 'hidden'
     }
  }
}, { tracker: Tracker }));
