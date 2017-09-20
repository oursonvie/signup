Template.home.onCreated(function() {
  Session.set('searchStudent', false)
});

Template.home.helpers({
  ifSearch: function() {
    if (Session.get('searchStudent') == true) {
      return true
    } else {
      return false
    }
  },
  ifStudent: function() {
    if (Session.get('searchStudent')._id) {
      return true
    } else {
      return false
    }
  }
})

Template.home.events({
  "submit .checkID" (event, template) {

    Session.set('searchStudent', true)

    event.preventDefault();
    let userId = document.getElementById('UserID').value.trim()

    PromiseMeteorCall('findStudent', userId).then(res => {
      Session.set('searchStudent', res)
    }).catch(err => {
      Session.set('searchStudent', false)
      alert('学生不满足报名条件')
    })

  }
});
