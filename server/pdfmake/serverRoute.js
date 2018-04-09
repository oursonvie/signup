var AES = require("crypto-js/aes");

var PdfPrinter = require('pdfmake')

Picker.route('/api/pdf', function(params, req, res) {

  try {

    // console.log(params.query)

    let decrypted = AES.decrypt(params.query.doc, Meteor.settings.private.passphrase);

    var id = decrypted.toString(CryptoJS.enc.Utf8);

    console.log(`[PDF Request] docId = ${id}`)

    if (id) {
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
    } else {
      res.end('invalid key');
    }

  } catch(err) {
    console.log(err)
    res.send('ERROR:' + err);
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
