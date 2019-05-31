initCamera = () => {

  if (window.stream) {
   window.stream.getTracks().forEach(track => {
     track.stop();
   });
 }

 videoSource = ( (localStorage.getItem('selectCameraId') != 'undefined') ? localStorage.getItem('selectCameraId') : '' )

 const constraints = {
   video: {deviceId: videoSource ? {exact: videoSource} : undefined}
 };

 navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);

}

switchCamera = (videoId) => {

  if (window.stream) {
   window.stream.getTracks().forEach(track => {
     track.stop();
   });
 }

 const videoSource = videoId
 const constraints = {
   video: {deviceId: videoSource ? {exact: videoSource} : undefined}
 };

 navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);

}

gotStream = (stream) => {

  const videoElement = document.querySelector('video');

  window.stream = stream; // make stream available to console
  video.srcObject = stream;
  video.play()
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

handleError = (error) => {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

cameraSelector = (devicesList) => {

  filteredList = []

  _.forEach(devicesList, function(deviceInfo) {

    if (deviceInfo.kind == 'videoinput') {

      obj = {
        value : deviceInfo.deviceId,
        text : deviceInfo.label || `camera ${videoSelect.length + 1}`
      }

      filteredList.push(obj)
    }
  })

  // alert(JSON.stringify(filteredList))

  Session.set('cameraList', filteredList)
}

cameraList = () => {
  // get devices list
  navigator.mediaDevices.enumerateDevices()
  .then(cameraSelector)
  .catch(handleError);
}
