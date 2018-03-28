Template.addDate.rendered=function() {
	$('.datetimepicker').datetimepicker();
}

Template.addDate.events({
	'click .btn-settime': function(event, template) {
		starttime = moment(document.getElementById("datetimepicker").value).format('YYYY-MM-DD HH:mm:ss')

    duration = document.getElementById("examduration").value

    Session.set('setDate', {edit:false, starttime: starttime, duration: duration})
	}
})
