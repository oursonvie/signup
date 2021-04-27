Meteor.publish('studentCount', function() {
  Counts.publish(this,'studentCount', Student.find({}))
  Counts.publish(this,'signedStudentCount', Student.find({edited:true}))
})

Meteor.publish('studentCountLanguage', function() {
  Counts.publish(this,'英语', Student.find({edited:true, language: '英语'}))
  Counts.publish(this,'俄语', Student.find({edited:true, language: '俄语'}))
  Counts.publish(this,'法语', Student.find({edited:true, language: '法语'}))
  Counts.publish(this,'德语', Student.find({edited:true, language: '德语'}))
  Counts.publish(this,'日语', Student.find({edited:true, language: '日语'}))
})

Meteor.publish('photoCount', function() {
  Counts.publish(this,'photoCount', Image.find())
})

Meteor.publish('suspectStudentCount', function() {
  Counts.publish(this,'suspectStudentCount', SuspectStudents.find())
})

Meteor.publish('baiduCount', function() {
  Counts.publish( this,'syncedCount', BaiduStudents.find({baidu:{$exists:true}}) )
})

Meteor.publish('studentCountByTime', function() {
  Counts.publish(this,'1', Student.find({edited:true, examTime: '1'}))
  Counts.publish(this,'2', Student.find({edited:true, examTime: '2'}))
  Counts.publish(this,'3', Student.find({edited:true, examTime: '3'}))
  Counts.publish(this,'4', Student.find({edited:true, examTime: '4'}))
  Counts.publish(this,'5', Student.find({edited:true, examTime: '5'}))
  Counts.publish(this,'6', Student.find({edited:true, examTime: '6'}))
})
