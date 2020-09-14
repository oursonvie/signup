Template.signedStudentInfo.helpers({
  updateAt: function(){
     if (this.updateAt) {
       return moment(this.updateAt).format('YYYY-MM-DD HH:mm:ss')
     }
  },
  certnoLastFour: function() {
    return this.certno.slice(-4)
  }
});
