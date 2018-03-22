Template.singleExamroom.onCreated(function() {
  this.editMode = new ReactiveVar( false )
});

Template.singleExamroom.helpers({
  editMode: function() {
    return Template.instance().editMode.get();
  },
  updateExamroomFormId: function() {
    return this._id
  },
  occupied: function() {
    if (this.seats) {
      return `${this.seats.length}/${this.capacity}`
    } else {
      return `0/${this.capacity}`
    }
  }
});

Template.singleExamroom.events({
  'click .fa-edit': function(event, template) {
    template.editMode.set(!template.editMode.get())
  },
  'click .btn-save': function(event, template) {
    template.editMode.set(!template.editMode.get())
  }
});
