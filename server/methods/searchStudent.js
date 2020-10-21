Meteor.methods({
  searchStudent:function(certno){
     targetStudent = Student.findOne({_id: certno})
     try {
       if (targetStudent) {
         return {error:0, content: targetStudent}
       } else {
         return {error:404, message: `no student`}
       }
     } catch(e) {
       throw new Meteor.Error( e );
     }

  }
});
