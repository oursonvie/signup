Template.updateStudentForm.events({
  "click .btn-test": function (event, template) {

    PromiseMeteorCall('checkValidSignup', Session.get('searchStudent'))
      .then(res => {
        if (res.error == 0) {
          document.getElementById('callAutoform').click();
        } else {
          alert(res.error)
        }
      })
      .catch(err => {
        console.log(err)
      })

  }
});
