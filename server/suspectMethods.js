Meteor.methods({
  insertSuspectStudent:function(id, photoId){
     let saveObj = Seats.findOne({certno:id},{fields:{_id:0, meteorId:0}})
     saveObj.photoId = photoId
     saveObj.createdAt = new Date
     saveObj.createdBy = this.userId

     SuspectStudents.insert(saveObj)

     console.log(saveObj)
  },
  downloadSuspect:function(){
    return CSV.unparse(SuspectStudents.find({}, {fields:{_id:0, photoId:0, createdBy:0 }}).fetch())
  },
  deleteSuspectStudent: function(id) {
    let suspectData = SuspectStudents.findOne({certno:id})
    // remove suspect data
    SuspectStudents.remove({certno:id})

    //remove images
    Images.remove({_id:suspectData.photoId})

    return 1
  },
  updateSuspectStudent: function(id, score) {
    SuspectStudents.update({certno:id}, {$set: {baiduAPIScore: score}})
  }
});
