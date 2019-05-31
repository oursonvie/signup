Template.photoPage.helpers({
  targetPic: function() {
    if ( Image.findOne() ) {
      return base64ImageFixer(Image.findOne().doccontent)
    }
  },
  baiduResult: function() {
    if (Session.get('baiduResult') && Session.get('baiduResult').error_code == 0) {

      score = Session.get('baiduResult').result.score || Session.get('baiduResult').result.user_list && Session.get('baiduResult').result.user_list[0].score

      return (score ? Number(score.toFixed(0)) : 0)
    } else {
      return false
    }
  },
  studentInfo: function() {
    return BaiduStudents.findOne({studentid: Session.get('studentNoQuery')})
  },
  SeatInfo: function() {
    return Seats.findOne()
  }
});
