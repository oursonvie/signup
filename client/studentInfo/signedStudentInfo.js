Template.signedStudentInfo.helpers({
  updateAt: function(){
     if (this.updateAt) {
       return moment(this.updateAt).format('YYYY-MM-DD HH:mm:ss')
     }
  },
  certnoLastFour: function() {
    return (this.certno) ? this.certno.slice(-4) : his._id.slice(-4)
  }
});
