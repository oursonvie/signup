var AipFaceClient = require("baidu-aip-sdk").ocr;

// 设置APPID/AK/SK
var APP_ID = Meteor.settings.private.baidu.APP_ID;
var API_KEY = Meteor.settings.private.baidu.API_KEY;
var SECRET_KEY = Meteor.settings.private.baidu.SECRET_KEY;

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);

var idCardSide = "front";

Meteor.methods({
  idcardQuery:function(image) {
    // 调用身份证识别
    try {
      result = Promise.await(client.idcard(image, idCardSide))
      return result
    } catch (e) {
      console.log(e)
    }

  }
});
