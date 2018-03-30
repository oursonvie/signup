Meteor.startup(function () {

  if ( Meteor.users.find().count() === 0 ) {
      var id = Accounts.createUser({
          email: 'oursonvie@qq.com',
          password: 'hacker'
      });
      Roles.addUsersToRoles(id, ['admin', 'superadmin'])
  }

});
