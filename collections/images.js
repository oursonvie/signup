import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 2097152 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return '图片太大, 请缩小到2MB以内再上传';
  }
});
