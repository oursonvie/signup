var pdfMakePrinter =  require('../node_modules/pdfmake/src/printer');
var path = require('path');




Picker.route('/api/pdf/:_id', function(params, req, res) {
  var id = params._id;

  PromiseMeteorCall('printExamID', id)
  .then(response => {

    createPdfBinary(response, function(binary) {
      // res.contentType('application/pdf');
      res.setHeader('content-type', 'application/pdf');
      // res.send(binary);


      res.end(binary);
    }, function(error) {
      res.send('ERROR:' + error);
    });


  })
  .catch(err => console.log(err))
});


function createPdfBinary(pdfDoc, callback) {

  var fontDescriptors = {
         Roboto: {
              normal: path.join(__dirname, '..', '/Users/Tonny/Desktop/Assignment/Signup/meteor/node_modules/pdfmake/examples/fonts', 'Microsoft YaHei.ttf'),
              bold: path.join(__dirname, '..', '/Users/Tonny/Desktop/Assignment/Signup/meteor/node_modules/pdfmake/examples/fonts', 'Microsoft YaHei.ttf'),
              italics: path.join(__dirname, '..', '/Users/Tonny/Desktop/Assignment/Signup/meteor/node_modules/pdfmake/examples/fonts', 'Microsoft YaHei.ttf'),
              bolditalics: path.join(__dirname, '..', '/Users/Tonny/Desktop/Assignment/Signup/meteor/node_modules/pdfmake/examples/fonts', 'Microsoft YaHei.ttf')
            }
      }

  var printer = new pdfMakePrinter(fontDescriptors);

  var doc = printer.createPdfKitDocument(pdfDoc);

  var chunks = [];
  var result;

  doc.on('data', function (chunk) {
    chunks.push(chunk);
  });

  doc.on('end', function () {
    result = Buffer.concat(chunks);
    callback(result)
    // callback('data:application/pdf;base64,' + result.toString('base64'));
  });

  doc.end();

}
