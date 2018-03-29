require('pdfmake/build/pdfmake.js');
require('pdfmake/build/vfs_fonts.js');

Template.pdfPrint.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var candidateId = FlowRouter.getParam('id');
        self.subscribe('examCert', candidateId);
    });
});

Template.pdfPrint.helpers({
  candidateInfo: function() {
    return Seats.findOne({})
  },
  examroomInfo: function() {
    return Examroom.findOne({})
  },
  studentPhoto: function() {
    return Image.findOne({})
  }
})

Template.pdfPrint.events({
  'click .btn-download': function() {
    console.log(123)

    PromiseMeteorCall('printExamID', FlowRouter.getParam('id'))
    .then(res => {
      pdfMake.fonts = {
             YaHei: {
               normal: 'Microsoft YaHei.ttf',
               bold: 'Microsoft YaHei.ttf',
               italics: 'Microsoft YaHei.ttf',
               bolditalics: 'Microsoft YaHei.ttf'
             },
             Roboto: {
                  normal: 'Microsoft YaHei.ttf',
                  bold: 'Microsoft YaHei.ttf',
                  italics: 'Microsoft YaHei.ttf',
                  bolditalics: 'Microsoft YaHei.ttf'
                }
          }

      pdfMake.createPdf(res).download('test.pdf')

    })
    .catch(err => console.log(err))
  }
})
