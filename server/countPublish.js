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
