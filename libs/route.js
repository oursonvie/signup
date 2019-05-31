FlowRouter.route('/', {
   name: 'home',
    action() {
        BlazeLayout.render('UserLayout', {main: 'home'});
    }
});

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

FlowRouter.route('/examroom/:id', {
   name: 'examroomList',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'examroomList'});
    }
});

FlowRouter.route('/candidate/:id', {
   name: 'candidatePage',
    action() {
        BlazeLayout.render('PrintLayout', {main: 'candidatePage'});
    }
});

FlowRouter.route('/scandidate', {
   name: 'scandidate',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'scandidate'});
    }
});

FlowRouter.route('/mobile', {
   name: 'mobileHome',
    action() {
        BlazeLayout.render('AdminLayout', {main: 'mobileHome'});
    }
});
