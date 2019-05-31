FaceLogs = new Mongo.Collection('facelogs');

FaceLogs.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function(){
    return false;
  }
})

FaceLogs.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function(){
    return true;
  }
})
