Meteor.methods({
  randomlizeExamroom: function() {
    rawList = Student.find({},{fields:{_id:1}}).fetch()
    sortedList = []
    // random array
    n = rawList.length
  	for ( i = 0; i < n - 1; i++) {
  		sortedList.push(rawList.splice(Math.floor(Math.random()*rawList.length),1)[0]._id)
  	}
    sortedList.push(rawList[0])

    // devide into group of 30
    let arrays = [], size = 30;

    while (sortedList.length > 0)
      arrays.push(sortedList.splice(0, size));

    console.log(arrays)

    // put group id into each examroom

  }
});
