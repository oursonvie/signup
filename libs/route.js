FlowRouter.route('/admin', {
   name: 'adminPage',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'adminPage'});
    }
});

FlowRouter.route('/', {
   name: 'home',
    action() {
        BlazeLayout.render('UserLayout', {main: 'home'});
    }
});
