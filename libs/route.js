FlowRouter.route('/admin', {
   name: 'studentPage',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'studentPage'});
    }
});

FlowRouter.route('/examroom', {
   name: 'examroomPage',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'examroomPage'});
    }
});

FlowRouter.route('/', {
   name: 'home',
    action() {
        BlazeLayout.render('UserLayout', {main: 'home'});
    }
});
