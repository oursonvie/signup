Template.examroomPage.onCreated(function() {
  // reset searchStudent Session
  Session.set('searchStudent', false)

  var self = this
  self.autorun(function() {
    // subscribe regiestered student count
    self.subscribe('studentCount');
    self.subscribe('examrooms');

    // autorun search bar
    let certno = Session.get('searchStudent')
    if (certno) {
      PromiseMeteorCall('convertCert', certno)
        .then(res => {
          let result = `${Meteor.absoluteUrl()}api/pdf?${res}`
          window.open(result)
        })
        .catch(err => console.log(err))
    }

  });
});

Template.examroomPage.helpers({
  studentCount: function() {
    return Counts.get('studentCount')
  },
  examroomNeeded: function() {
    return Math.ceil(Counts.get('studentCount') / 30)
  },
  examrooms: function() {
    return Examroom.find()
  }
});

Template.examroomPage.events({
  'click .btn-random': function() {
    PromiseMeteorCall('randomlizeExamroom')
      .then(res => {
        Session.set('randomExamroom', res)
      })
      .catch(err => console.log(err))
  },
  'click .btn-download': function() {
    console.log('download examroom template')


    PromiseMeteorCall('downloadExamRoom')
      .then(res => {
        if (res) {
          let blob = new Blob([res], {
            type: "text/plain;charset=utf-8"
          });
          saveAs(blob, '教室编号.csv')
        }
      })

  },
  'click .btn-seat-download': function() {
    console.log('download seating infor')


    PromiseMeteorCall('downloadSeats')
      .then(res => {
        if (res) {
          let blob = new Blob([res], {
            type: "text/plain;charset=utf-8"
          });
          saveAs(blob, '座位列表.csv')
        }
      })
  },
  'click .btn-clean': function() {
    PromiseMeteorCall('cleanExamroom')
      .then(res => console.log(res))
      .catch(err => console.log(err))
  },
  // import function
  'change #examroomUpload': function(event, template) {
    // check datetime been set for the current examnation
    dateInfo = Session.get('setDate')

    let filesList = event.currentTarget.files;
    if (filesList.length) {
      let file = filesList[0];
      if (file.type === 'text/csv') {
        let fileReader = new FileReader();
        fileReader.onload = function(e) {
          var papaObject = CSV.parse(fileReader.result, {
            header: true,
            encoding: "UTF-8"
          });
          console.log('papaObject', papaObject);

          if (papaObject && papaObject.errors.length == 0) {
            Meteor.call('importExamroom', papaObject.data)
          } else {
            throw papaObject.errors
          }

          Session.set('uploadedData', papaObject);
        };
        fileReader.onerror = function(e) {
          throw 'Error reading CSV file';
        };
        fileReader.readAsText(file);
      }
    }

  },
  'click .btn-download-all': function() {

    allRooms = Examroom.find({}, {
      fields: {
        examroomId: 1
      }
    }).fetch()

    AllRoomId = arrayConvter(allRooms, 'examroomId')

    _.forEach(AllRoomId, function(id) {
      fetch(`${Meteor.absoluteUrl()}api/examroom?roomnumber=${id}`)
        .then(resp => resp.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          // the filename you want
          a.download = `考场${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          console.log(`${id} has been downloaded`); // or you know, something with better UX...
        })
        .catch(() => alert('oh no!'));
    })


  }
});
