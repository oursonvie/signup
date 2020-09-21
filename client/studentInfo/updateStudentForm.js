Template.updateStudentForm.events({
  "click .btn-submit"(event, template) {

    let family_name = document.getElementById('family_name').value
    let first_name = document.getElementById('first_name').value
    let language = document.getElementById('language').value

    if ( !family_name ) {
      alert(`姓氏不能为空`)
    } else if (!first_name) {
      alert(`名字不能为空`)
    } else if ( language == '选择' ) {
      alert(`请选择报考语言`)
    } else {
      PromiseMeteorCall('signupStudent', this._id, family_name, first_name, language)
      .then( res => {
        console.log(res)

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
