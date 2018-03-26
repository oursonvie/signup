import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Student = new Mongo.Collection("student");

Student.deny({
  insert: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function(){
    return !Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});

Student.allow({
  update: function(){
    return true
  }
})


Student.attachSchema(new SimpleSchema({
  certno: {
    type: String,
    label: "身份证",
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  name: {
    type: String,
    label: "姓名",
    optional: true
  },
  sex: {
    type: String,
    label: "性别",
    optional: true
  },
  race: {
    type: String,
    label: "名族",
    optional: true
  },
  birthday: {
    type: String,
    label: "出生日期",
    optional: true
  },
  degree: {
    type: String,
    label: "就读专业",
    optional: true
  },
  level: {
    type: String,
    label: "培养层次",
    optional: true
  },
  studentid: {
    type: String,
    label: "学号",
    optional: true
  },
  lcenter: {
    type: String,
    label: "学习中心",
    optional: true
  },
  batchcode: {
    type: Number,
    label: "批次",
    optional: true
  },
  source: {
    type: String,
    label: "来源"
  },
  family_name: {
    type: String,
    label: "拼音（姓）",
    autoValue: function() {
      if (this.isInsert) {
        return ' '
      } else if (this.isUpdate) {
        return lodash.capitalize(this.value)
      }
    }
  },
  first_name: {
    type: String,
    label: "拼音（名）",
    autoValue: function() {
      if (this.isInsert) {
        return ' '
      } else if (this.isUpdate) {
        return lodash.capitalize(this.value)
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
      } else {
        return true
      }
    },
    autoform: {
      type: 'hidden'
    }
  }
}, { tracker: Tracker }));
