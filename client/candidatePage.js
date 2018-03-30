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
    return base64ImageFixer(content)
  },
  examtime: function() {
    dateInfo = Examroom.findOne({},{fields:{starttime:1, duration:1}})
    if (dateInfo && dateInfo.starttime && dateInfo.duration) {
      return examDateTimeConverter(dateInfo.starttime, dateInfo.duration)
    }
  },
  logoUrl: function() {
    return Meteor.settings.public.logoUrl
  }
})
