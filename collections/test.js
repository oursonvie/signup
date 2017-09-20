import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Test = new Mongo.Collection("test");

Test.attachSchema(new SimpleSchema({
  certno: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    optional: true
  },
  sex: {
    type: String,
    optional: true
  },
  race: {
    type: String,
    optional: true
  },
  birthday: {
    type: String,
    optional: true
  },
  degree: {
    type: String,
    optional: true
  },
  level: {
    type: String,
    optional: true
  },
  studentid: {
    type: String,
    optional: true
  },
  lcenter: {
    type: String,
    optional: true
  },
  family_name: {
    type: String,
    optional: true
  },
  first_name: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  company: {
    type: String,
    optional: true
  },
  language: {
    type: String,
    optional: true
  },
  createdBy: {
    type: String,
    autoValue:function(){
       return this.userId
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
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date
      }
    },
     autoform: {
       type: 'hidden'
     }
  }
}, { tracker: Tracker }));
