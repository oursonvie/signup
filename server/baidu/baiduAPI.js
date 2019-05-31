var AipFaceClient = require("baidu-aip-sdk").face;
var HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置APPID/AK/SK
var APP_ID = Meteor.settings.private.baidu.APP_ID;
var API_KEY = Meteor.settings.private.baidu.API_KEY;
var SECRET_KEY = Meteor.settings.private.baidu.SECRET_KEY;

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);

// set timeout
HttpClient.setRequestOptions({timeout: 3000});

Meteor.methods({
  // baidu face comparison methods
  baidu_compare: function(faceA, faceB) {

    let images = [
      {image: faceA,
      image_type: 'BASE64'
      },
      {image: faceB,
      image_type: 'BASE64'
      }
    ]

    // control parameters
    let options = {};
    options["liveness_control"] = "NORMAL";

    try {
      let result = Promise.await(client.match(images))
      // console.log(JSON.stringify(result))
      return result
    } catch(err) {
      console.log(err)
    }

  },
  // baidu face search
  baidu_face_search: function(image, groupId) {
    var imageType = "BASE64";

    var groupIdList = groupId;

    // control parameters
    let options = {};
    options["quality_control"] = "NORMAL";
    options["liveness_control"] = "NORMAL";
    options["max_user_num"] = "1";

    try {
      let result = Promise.await(client.search(image, imageType, groupIdList, options))

      return result
    } catch(err) {
      console.log(err)
    }

  },
  // face register
  baidu_face_add: function(image, groupId, userId) {

    var imageType = "BASE64";

    try {
      let result = Promise.await(client.addUser(image, imageType, groupId, userId))
      return result
    } catch(err) {
      console.log(err)
    }

  },
  baidu_face_remove: function(userId, groupId, faceToken) {
    try {
      let result = Promise.await(client.faceDelete(userId, groupId, faceToken))
      return result
    } catch(err) {
      console.log(err)
    }
  },
  baidu_check_group: function(groupId) {
    // set return list length to 1000
    let options = {}
    options["length"] = "1000";

    try {
      let result = Promise.await(client.getGroupUsers(groupId, options))
      return result
    } catch(err) {
      console.log(err)
    }
  },
  baidu_check_group_start: function(groupId, startNo) {
    // set return list length to 1000
    let options = {}
    options["start"] = startNo.toString();
    options["length"] = "1000";

    try {
      let result = Promise.await(client.getGroupUsers(groupId, options))
      return result
    } catch(err) {
      console.log(err)
    }
  },
  baidu_check_face_list: function(userId, groupId) {
    try {
      let result = Promise.await(client.faceGetlist(userId, groupId))
      return result
    } catch(err) {
      console.log(err)
    }
  },
  baidu_delete_group: function(groupId) {
    try {
      let result = Promise.await(client.groupDelete(groupId))
      return result
    } catch(err) {
      console.log(err)
    }
  },
  baidu_delete_user: function(groupId, userId) {
    try {
      let result = Promise.await(client.deleteUser(groupId, userId))
      return result
    } catch(err) {
      console.log(err)
    }
  },
  baidu_face_verify: function(image) {
    try {
      let result = Promise.await(client.faceverify([{
        image: image,
        image_type: 'BASE64'
    }])
      )
      return result
    } catch(err) {
      console.log(err)
    }
  },
  // baidu face search
  baidu_face_search_no_control: function(image, groupId) {
    var imageType = "BASE64";

    var groupIdList = groupId;

    // control parameters
    let options = {};
    options["quality_control"] = "NORMAL";
    options["liveness_control"] = "NONE";
    options["max_user_num"] = "1";

    try {
      let result = Promise.await(client.search(image, imageType, groupIdList, options))

      return result
    } catch(err) {
      console.log(err)
    }

  }
})
