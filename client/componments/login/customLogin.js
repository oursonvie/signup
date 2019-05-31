Template.customLogin.helpers({
  currentUserEmail: function(){
    return Meteor.user().emails[0].address
  }
});

Template.customLogin.events({
  "submit form": function(event, template){
    event.preventDefault()
    const username = document.getElementById('emailInput').value.trim()
    const password = document.getElementById('passwordInput').value.trim()

    Meteor.loginWithPassword(username, password)
  },
  "click #logout": function() {
    Meteor.logout()
  }
});
