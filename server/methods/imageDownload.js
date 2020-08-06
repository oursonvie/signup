Meteor.methods({
  getAllPicId: function() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      let imageList = Image.find({}, {
        fields: {
          certificateno: 1
        }
      }).fetch()

      return imageList
    } else {
      throw new Meteor.Error('500', 'No Premission');
    }
  },
  downloadPic: function(id) {
    if (Roles.userIsInRole(this.userId, ['admin'])) {

      image = Image.findOne({
        _id: id
      }, {
        fields: {
          doccontent:1
        }
      })

      try {

        var block = convertImage(image.doccontent).split(";")
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];

        return {
          realData: realData,
          contentType: contentType,
        }
      } catch (e) {
        console.log(e)
        throw new Meteor.Error(e);
      }


    } else {
      throw new Meteor.Error('500', 'No Premission');
    }
  }
});
