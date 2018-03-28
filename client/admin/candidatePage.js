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
  }
})
