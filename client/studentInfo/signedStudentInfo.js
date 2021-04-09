Template.signedStudentInfo.helpers({
  updateAt: function(){
     if (this.updateAt) {
       return moment(this.updateAt).format('YYYY-MM-DD HH:mm:ss')
     }
  },
  certnoLastFour: function() {
    return (this.certno) ? this.certno.slice(-4) : this._id.slice(-4)
  },
  examTime: function(id) {
    let examTimeTable = Meteor.settings.public.examChoice
    let examIndex = lodash.findIndex(examTimeTable, {'id': parseInt(id)} );
    return examTimeTable[examIndex].time
  }
});
