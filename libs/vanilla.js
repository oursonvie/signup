// reset sessions in cam page
resetSessions = () => {
  Session.set('studentPic', false)
  Session.set('targetPic', false)
  Session.set('certNoQuery', false)
  Session.set('baiduResult', false)
  Session.set('searching', false)
  Session.set('studentNoQuery',false)
  Session.set('noValidExam', false)
  Session.set('ocring', false)
}
