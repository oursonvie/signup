require('pdfmake/build/pdfmake.js');
require('pdfmake/build/vfs_fonts.js');

Template.examroomList.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var examroomId = parseInt(FlowRouter.getParam('id'));
        self.subscribe('examroomsOne', examroomId);
        self.subscribe('seatsStudentExamroom', examroomId);
    });
});

Template.examroomList.helpers({
  Seats: function() {
    return Seats.find()
  },
  ExamroomNumber: function() {
    return FlowRouter.getParam('id').padStart(3, '0')
  },
  thisRoom: function() {
    return Examroom.findOne()
  }
})

Template.examroomList.events({
  'click .btn-download': function() {
    let examroom = Examroom.findOne()

    PromiseMeteorCall('generateExamroomList', examroom.examroomId)
    .then(res => {
      pdfMake.fonts = {
             Roboto: {
                  normal: 'Microsoft YaHei.ttf',
                  bold: 'Microsoft YaHei.ttf',
                  italics: 'Microsoft YaHei.ttf',
                  bolditalics: 'Microsoft YaHei.ttf'
            }
      }

      pdfMake.createPdf(res).download(`考点编号_10698_考场号${examroom.examroomId}`);

    })
    .catch(err => console.log(err))

  }
})
