Template.cameraSelectModal.helpers({
  cameraList: function(){
     return Session.get('cameraList')
  }
});

Template.cameraSelectModal.events({
  "click li": function(event, template){
    switchCamera(this.value)

    localStorage.setItem('selectCameraId', this.value);
    localStorage.setItem('selectCameraName', this.text);

    $('#switchCameraModal').modal('hide')
    console.log(`switch to camera ${this.text}`)
  }
});
