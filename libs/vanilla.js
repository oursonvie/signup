lodash = require('lodash');

// reset sessions in cam page
resetSessions = () => {
  Session.set('studentPic', false)
  Session.set('targetPic', false)
  Session.set('certNoQuery', false)
  Session.set('baiduResult', false)
  Session.set('searching', false)
  Session.set('studentNoQuery',false)
  Session.set('noValidExam', false)
  Session.set('ocring', false)
}

resetLocalStorage = () => {
  localStorage.removeItem('selectCameraId');
  localStorage.removeItem('selectCameraName');
}

convertImage = (image) => {
  if (image) {
    if ( image.split(',').length == 2 ) {
      return image
    } else {
      return `data:image/jpeg;base64,${image}`
    }
  } else {
    return `null`
  }
}

// client side only
b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

// conver object array in to array
arrayConvter = (array, key) => {
  result = []
  _.forEach(array, function(item) {
    result.push(item[key])
  })
  return result
}

examTimeIDLookUp = (id) => {
  /*
  let examInfo = Meteor.settings.public.examChoice
  let examtimeIndex = lodash.findIndex(examInfo, {id:parseInt(id)} )
  return examInfo[examtimeIndex].time
  */
  let examInfo = Meteor.settings.public.examChoice
  return examInfo.find( (item) => item.id == parseInt(id) ).time

}
