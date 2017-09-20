import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Test = new Mongo.Collection("test");

Test.deny({
  insert: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});

Test.allow({
  update: function(){
    return true
  }
})


Test.attachSchema(new SimpleSchema({
  certno: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  name: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  sex: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  race: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  birthday: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  degree: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  level: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  studentid: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  lcenter: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  family_name: {
    type: String,
    label: "拼音（姓）",
    autoValue: function() {
      if (this.isInsert) {
        return ' '
      } else {
        if (/^[a-z]+$/i.test(this.value)) {
          return lodash.capitalize(this.value)
        } else {
          alert('姓名只能输入拼音')
        }
      }
    }
  },
  first_name: {
    type: String,
    label: "拼音（名）",
    autoValue: function() {
      if (this.isInsert) {
        return ' '
      } else {
        if (/^[a-z]+$/i.test(this.value)) {
          return lodash.capitalize(this.value)
        } else {
          alert('姓名只能输入拼音')
        }
      }
    }
  },
  phone: {
    type: String,
    label: "个人联系电话",
    autoValue: function() {
      if (this.isInsert) {
        return ' '
      }
    }
  },
  company: {
    type: String,
    label: "现工作单位",
    autoValue: function() {
      if (this.isInsert) {
        return ' '
      }
    }
  },
  language: {
    type: String,
    label: "考试语种",
    autoform: {
      type: "select",
      options: () => {
        return[
          {label: "英语", value:"英语"},
          {label: "俄语", value:"俄语"},
          {label: "法语", value:"法语"},
          {label: "德语", value:"德语"},
          {label: "日语", value:"日语"},
        ]
      }
    },
    autoValue: function() {
      if (this.isInsert) {
        return "英语"
      }
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
  },
  edited: {
    type: Boolean,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return false
      }
    },
    autoform: {
      type: 'hidden'
    }
  }
}, { tracker: Tracker }));
