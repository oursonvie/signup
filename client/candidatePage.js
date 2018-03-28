Template.candidatePage.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var candidateId = FlowRouter.getParam('id');
        self.subscribe('examCert', candidateId);
    });
});

Template.candidatePage.helpers({
  candidateInfo: function() {
    return Seats.findOne({})
  },
  examroomInfo: function() {
    return Examroom.findOne({})
  },
  numberPadding: function(input, padding) {
    return input.toString().padStart(padding, '0')
  },
  studentPhoto: function() {
    return Image.findOne({})
  },
  baseHeader: function(content) {
    if (content.split(',').length != 2) {
      return "data:image/jpeg;base64," + content
    } else {
      return content
    }
  },
  examtime: function() {
    dateInfo = Examroom.findOne({},{fields:{starttime:1, duration:1}})
    if (dateInfo && dateInfo.starttime && dateInfo.duration) {
      starttime = moment(dateInfo.starttime).format('YYYY-MM-DD HH:mm')
      duration = dateInfo.duration
      endtime = moment(starttime).add(duration, 'hours').format('HH:mm')
      return `${starttime} - ${endtime}`
    }
  },
  xjtulogo: function() {
    return xjtulogo()
  }
})
