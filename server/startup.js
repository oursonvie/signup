Meteor.startup(function () {

  if ( Meteor.users.find().count() === 0 ) {
      let superAdminAccount = Accounts.createUser({
          email: 'oursonvie@qq.com',
          password: 'hacker'
      });

      let adminAccount = Accounts.createUser({
          email: 'xjtuxj@xjtudlc.com',
          password: '82667910'
      });

      // add super admin
      Roles.addUsersToRoles(superAdminAccount, ['admin', 'superadmin'])

      // add admin
      Roles.addUsersToRoles(adminAccount, ['admin'])
  }

});
