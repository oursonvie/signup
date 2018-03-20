Template.singleExamroom.onCreated(function() {
  this.editMode = new ReactiveVar( false )
});

Template.singleExamroom.helpers({
  editMode: function() {
    return Template.instance().editMode.get();
  },
  updateExamroomFormId: function() {
    return this._id
  }
});

Template.singleExamroom.events({
  'click .fa-edit': function(event, template) {
    template.editMode.set(!template.editMode.get())
  }
});
