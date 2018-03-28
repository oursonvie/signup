Template.candidatePage.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var candidateId = FlowRouter.getParam('id');
        self.subscribe('seatOne', candidateId);
    });
});

Template.candidatePage.helpers({
  candidateInfo: function() {
    return Seats.findOne({})
  },
  numberPadding: function(input, padding) {
    return input.toString().padStart(padding, '0')
  }
})