Template.nav.events({
  "click .btn-query" (event, template) {
    event.preventDefault();
    let userId = document.getElementById('UserID').value.trim().toUpperCase()
    Session.set('searchStudent', userId)
  },
  "click .btn-reset" (event, template) {
    event.preventDefault();
    document.getElementById('UserID').value = ''
    Session.set('searchStudent', false)
  }
})
