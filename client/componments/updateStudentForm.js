Template.updateStudentForm.events({
  "click .btn-submit": function (event, template) {

    PromiseMeteorCall('checkValidSignup', Session.get('searchStudent'))
      .then(res => {
        if (res.error == 0) {

          let family_name = document.getElementById('familyName').value.trim()
          let first_name = document.getElementById('firstName').value.trim()
          let language = document.getElementById('language').value.trim()


          if (language) {
            let checkName = family_name + first_name

            if (/^[a-z]+$/i.test(checkName)) {

              console.log('ok to go')

            } else {
              alert('姓名只允许拼音')
              return false
              throw new Meteor.Error('Input Error', 'Only letter accepted')
            }
          } else {
            alert('请选择考试语言')
            return false
            throw new Meteor.Error('Input Error', 'Language missing')
          }


        } else {
          alert(res.error)
        }
      })
      .catch(err => {
        console.log(err)
      })

  }
});
