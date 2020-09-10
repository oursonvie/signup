import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';
Template.uploadForm.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function() {
        template.currentUpload.set(this);
      });

      upload.on('end', function(error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {

          // when image uploaded insert student into suspect
          PromiseMeteorCall('insertSuspectStudent', Session.get('searchStudent'), fileObj._id)
            .then(res => {

              // compare faces
              PromiseMeteorCall('compareBaidu', Session.get('searchStudent'), fileObj._id)
                .then(res => {

                  if (res.error_code == 0 && res.result.score || res.result.score == 0) {

                    let result = res.result.score

                    // get student exam detail before calling beary
                    let student = Seats.findOne({
                      certno: Session.get('searchStudent')
                    }, {
                      fields: {
                        _id: 0,
                        meteorId: 0
                      }
                    })

                    student.baiduAPIScore = result

                    // beary chat push
                    PromiseMeteorCall('bearyFaceMatch', Session.get('searchStudent'), student)

                    // write result back into suspect student
                    PromiseMeteorCall('updateSuspectStudent', Session.get('searchStudent'), result)
                      .then(res => {
                        
                      })
                      .catch(err => console.log(err))
                  }

                })

                .catch(err => console.log(err))

            })
            .catch(err => console.log(err))

        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});
