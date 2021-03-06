let AipFaceClient = require("baidu-aip-sdk").face;

// 设置APPID/AK/SK
let APP_ID = Meteor.settings.private.baidu.APP_ID
let API_KEY = Meteor.settings.private.baidu.API_KEY
let SECRET_KEY = Meteor.settings.private.baidu.SECRET_KEY

// 新建一个对象，建议只保存一个对象调用服务接口
let client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);


Meteor.methods({
  compareBaidu:function(userId, picId){
     try {

       imageObj = Images.findOne( {_id:picId} )

       // get site pic of student
       let picUrl = imageObj.link()

        let response = Promise.await(PromiseHTTPCall('GET', picUrl,{npmRequestOptions: { encoding: null }}))

        // get base64 image
        let sitePic = new Buffer.from(response.content).toString('base64');

        // get db pic of student
        let rawPic = Image.findOne({certificateno:userId}).doccontent.split(',')[1] || Image.findOne({certificateno:userId}).doccontent

        // start comparing
        let images = [
          {image: sitePic, image_type: 'BASE64'},
          {image: rawPic, image_type: 'BASE64'}
        ]


        try {
            result = Promise.await(client.match(images))

            console.log(result)
            return result
          } catch(err) {
            console.log(err)
          }

        // return result
      } catch(err) {
        console.log(err)
      }

  }
});
