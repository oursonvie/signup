Template.scandidate.onCreated(function() {
  Session.set('searchStudent',false)
  // Session.set('searchStudent','612524199409150624')
  var self = this
  self.autorun(function() {
    self.subscribe('examCert', Session.get('searchStudent'));
    self.subscribe('suspectStudent', Session.get('searchStudent'));
    self.subscribe('suspectStudentCount');

    if (SuspectStudents.findOne()) {
      self.subscribe('onSitePic', SuspectStudents.findOne().photoId)
    }

  });
});

Template.scandidate.helpers({
  ifSearch: () => {
    return Session.get('searchStudent')
  },
  Students: function() {
    return Student.findOne({})
  },
  studenPhoto: function() {
    if (Image.find().count() == 0) {
      return false
    } else {
      return Image.findOne()
    }
  },
  seatsInfo: function() {
    return Seats.findOne()
  },
  onSitePic: () => {
    return Images.findOne()
  },
  showResult: () => {
    if (SuspectStudents.findOne() && SuspectStudents.findOne().hasOwnProperty('baiduAPIScore')) {
      return true
    } else {
      return false
    }
  },
  SuspectStudents: () => {
    return SuspectStudents.findOne()
  },
  suspectStudentCount: () => {
    return Counts.get('suspectStudentCount');
  },
  displayPhoto: function(image) {
    var imgPart = image.split(',')

    if (imgPart.length == 2) {
      return image
    } else {
      return `data:image/jpeg;base64,${image}`
    }

  },
  scoreFormatter: function(score) {
    return score.toFixed(2)
  }
})

Template.scandidate.events({
  "submit .checkID" (event, template) {

    event.preventDefault();

    let inputValue = document.getElementById('nationid').value.trim()

    let userId = inputValue.toUpperCase()

    Session.set('searchStudent', userId)

  },
  "click .btn-reset" (event, template) {
    Session.set('searchStudent',false)
  },
  'click .btn-suspect-download': function(event, template) {
    var nameFile = '疑似考生名单.csv'

    PromiseMeteorCall('downloadSuspect')
    .then(res => {
      if (res) {
        let blob = new Blob([res], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, nameFile)
      }
    })
  },
  'click .btn-suspect-delete': function() {
    let result = confirm("确认删除学生？");
    if (result) {
      PromiseMeteorCall('deleteSuspectStudent', Session.get('searchStudent'))
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err))
    }
  }
});
