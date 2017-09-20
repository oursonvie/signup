Template.adminPage.onCreated(function() {
  var self = this
  self.autorun(function() {
    self.subscribe('regiesteredStudents');
  });
});

Template.adminPage.helpers({
  students: function(){
    return Test.find({})
  },
  signedNo: function() {
    return Test.find({}).count()
  }
});

Template.adminPage.events({
  'click .btn-download': function() {
    var nameFile = '学生名单.csv'
    Meteor.call('download', function(err, fileContent) {
      if (fileContent) {

        console.log(fileContent)

        var blob = new Blob([fileContent], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, nameFile);
      }
    });
  }
});
