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
    label: "考场地址",
    optional: true,
    autoform: {
      afFormGroup: {
        label: false
      }
    }
  },
  place: {
    type: String,
    label: "地址",
    optional: true,
    autoform: {
      afFormGroup: {
        label: false
      }
    }
  },
  address: {
    type: String,
    label: "校区",
    optional: true,
    autoform: {
      afFormGroup: {
        label: false
      }
    }
  },
  capacity: {
    type: Number,
    label: "容纳人数",
    autoValue: function() {
      if (this.isInsert) {
        if (!this.value) {
          return 30
        }
      }
    }
  },
  occupied: {
    type: Boolean,
    label: "已使用",
    autoValue: function() {
      if (this.isInsert) {
        return false
      }
    }
  },
  starttime: {
    type: String,
    label: "开始时间",
    autoValue: function() {
      if (this.isInsert) {
        if (!this.value) {
          return Meteor.settings.public.examtime.starttime
        }
      }
    }
  },
  duration: {
    type: Number,
    label: "考试时长",
    autoValue: function() {
      if (this.isInsert) {
        if (!this.value) {
          return Meteor.settings.public.examtime.duration
        }
      }
    }
  },
  language: {
    type: String,
    label: "考试语种",
    optional: true
  },
  seats: {
      type: Array,
      optional: true,
      autoform: {
        type:"hidden"
      }
  },
  'seats.$': {
      type: Object
  },
  'seats.$.seatnumber':{
    type: String,
    label: "座位号",
    autoform: {
        type:"hidden"
    }
  },
  'seats.$.meteorId':{
    type: String,
    label: "学生编号",
    autoform: {
        type:"hidden"
    }
  },
  'seats.$.name':{
    type: String,
    label: "学生姓名",
    autoform: {
        type:"hidden"
    }
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
