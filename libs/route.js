FlowRouter.route('/admin', {
   name: 'adminPage',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'adminPage'});
    }
});

FlowRouter.route('/admin/importStudent', {
   name: 'importStudent',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'importStudent'});
    }
});

FlowRouter.route('/', {
   name: 'home',
    action() {
        BlazeLayout.render('UserLayout', {main: 'home'});
    }
});
