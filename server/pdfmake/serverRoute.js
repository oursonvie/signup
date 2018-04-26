var PdfPrinter = require('pdfmake')

Picker.route('/api/pdf', function(params, req, res) {

  try {

    // console.log(params.query)

    let id = decryptAES(params.query.doc);

    let remoteHost = req.connection.remoteAddress

    let message = {docId: id, remoteIP: remoteHost, datetime: new Date}

    console.log(`[PDF Request] docId = ${id} from ${remoteHost} at ${message.datetime}`)

    PromiseMeteorCall('pushChat', 'PDF Request', message)

    if (id) {
      PromiseMeteorCall('printExamID', id)
      .then(response => {

        createPdfBinary(response, function(binary) {
          // res.contentType('application/pdf');
          res.setHeader('content-type', 'application/pdf');
          // res.send(binary);


          res.end(binary);
        }, function(error) {
          res.send(error);
        });


      })
      .catch(err => {
        res.end('ERROR:' + err);
      })
    } else {
      res.end('invalid key');
    }

  } catch(err) {
    console.log(err)
    res.end('ERROR:' + err);
  }

});


function createPdfBinary(pdfDoc, callback) {

  var fontDescriptors = {
         Roboto: {
              normal: Meteor.settings.private.font_YaHei,
              bold: Meteor.settings.private.font_YaHei,
              italics: Meteor.settings.private.font_YaHei,
              bolditalics: Meteor.settings.private.font_YaHei
            }
      }

  var printer = new PdfPrinter(fontDescriptors);

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
