Meteor.methods({
  updateBaiduList: function() {
    updateList = Student.find(
      {edited:true},
      {fields:{
        certno:1,
        studentid:1,
        name:1,
        lcenter:1,
        level:1,
        degree:1,
        batchcode:1,
        source:1,
        language:1
      }}
    ).fetch()

    // upsert
    _.forEach(updateList, function(student) {
      result = BaiduStudents.upsert(
        {certno:student.certno},
        {$set:student}
      )
      console.log(result)
    })

    return `[updateBaiduList] done`
  },
  syncAllStudents:function(){
     updateList = BaiduStudents.find(
       {baidu:{$exists:false}},
       {fields:{studentid:1, certno:1, source:1}}
     ).fetch()

     console.log(`{baiduSync} ${updateList.length} students`)

     _.forEach(updateList, function(item) {
       try {
         res = insertFace(item)
         console.log(res)
       } catch(err) {
         console.log(err)
       }
     })
  }
});

insertFace = (student) => {
  // put all students in single facedb
  groupId = 'students'
  try {
    targetPic = Image.findOne({certificateno:student.certno}).doccontent
    picContent = ( student.source == 'open' ) ? targetPic : targetPic.split(',')[1]

    if (targetPic) {
      result = Promise.await(PromiseMeteorCall('baidu_face_add', picContent, groupId, student.studentid))

      // save baidu result and image into unique students
      if (result.error_code == 0) {

        updateResult = BaiduStudents.update({
          certno: student.certno
        }, {
          $set: {
            baidu: result
          }
        })

        return `[Updated baidu & image] ${student.studentid} ${updateResult}`
      } else if (result.error_code == 223105) {
        // remove this student
        deleteResult = Promise.await(PromiseMeteorCall('baidu_delete_user', groupId, student.studentid))

        updateResult = BaiduStudents.update({
          certno: student.certno
        }, {
          $unset: {
            baidu: ''
          }
        })

        // unset failed students
        console.log(`delete student ${student.studentid}, result: ${$updateResult}`)

        throw new Meteor.Error('dulicate pic', result);

      } else {
        throw new Meteor.Error('error', result);
      }

    } else {
      return (`${student.studentid} has no pic`)
    }

  } catch (e) {
    console.log(`${student.certno}`)
    throw new Meteor.Error('error', e);
  }
}
