Template.updateStudentForm.onCreated(function() {
  // check full status
  Session.set('submitted', false)
});

Template.updateStudentForm.helpers({
  isSelected: function(language) {
     return this.language == language
  },
  ifSubmitted: function() {
    return Session.get('submitted')
  },
  timeOptions: function() {
    let examChoice = Meteor.settings.public.examChoice

    return examChoice != undefined ? examChoice : false
  }
});



Template.updateStudentForm.events({
  "click .btn-submit"(event, template) {

    let family_name = document.getElementById('family_name').value
    let first_name = document.getElementById('first_name').value
    let language = document.getElementById('language').value
    let examTime = document.getElementById('examTime').value

    let serverInfo = Session.get('serverInfo')

    // check input string

    let regex = /^[A-Za-z]+$/

    if ( !family_name ) {
      alert(`姓氏不能为空`)
    } else if (!first_name) {
      alert(`名字不能为空`)
    } else if ( language == '选择' ) {
      alert(`请选择报考语言`)
    } else if ( !regex.test(family_name) || !regex.test(first_name) ) {
      alert(`请输入姓名拼音`)
    } else if ( serverInfo.multipleTimeMode && examTime == '选择' ) {
      alert(`请选择考试时间`)
    } else {
      Session.set('submitted', true)
      PromiseMeteorCall('signupStudent', this._id, family_name, first_name, language, examTime)
      .then( res => {

        if ( res == 'success' ) {
          alert('报名成功')

          PromiseMeteorCall( 'searchStudent', Session.get('searchStudent') )
          .then( res => Session.set('student', res) )
          .catch( e => alert(e) )
        } else {
          alert('报名失败')

          PromiseMeteorCall( 'searchStudent', Session.get('searchStudent') )
          .then( res => Session.set('student', res) )
          .catch( e => alert(e) )
        }

      })
      .catch( err => {
        alert(err)
      })

    }

  }
});
