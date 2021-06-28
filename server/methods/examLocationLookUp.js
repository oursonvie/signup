Meteor.methods({
  examLocationLookUp:function(roomNumber) {
     let target = Examroom.findOne({examroomId: roomNumber},{seats:0})?.place
     return target ? target : '未知考点'
  }
});
