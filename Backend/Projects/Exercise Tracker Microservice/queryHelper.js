var queryParamValidate = function(queryObj){
  var userId = queryObj.userId;
  var from = queryObj.from;
  var to = queryObj.to;
  var limit = queryObj.limit;
  
  // invalid userId
  if (userId == undefined)
    return 1;
  // valid userId only
  else if (from == undefined && to == undefined && limit == undefined)
    return 2;
  // valid userId and limit only
  else if (from == undefined && to == undefined && limit != undefined)
    return 3;
  // valid userId and from only
  else if (from != undefined && to == undefined && limit == undefined)
    return 4;
  // valid userId and from and limit
  else if (from != undefined && to == undefined && limit != undefined)
    return 5;
  // valid userId and to
  else if (from == undefined && to != undefined && limit == undefined)
    return 6;
  // valid userId and to and limit 
  else if (from == undefined && to != undefined && limit != undefined)
    return 7;
  // // valid userId and from and to
  else if (from != undefined && to != undefined && limit == undefined)
    return 8;
  // valid everything
  else if (from != undefined && to != undefined && limit != undefined)
    return 9;
}

var exerciseCount = function(exercises, limit){
  // exercises comes in as object, so convert to array
  // to use array sort and split functions
  // the mongo shcema is an array, but when i do find it 
  // returns an object
  exercises.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
  })
  return exercises.splice(0,limit);
}

var exerciseFromCount = function(exercises, from){
  var jsDate = new Date(from);
  console.log(jsDate);
  return (exercises.filter(function(a){
    return new Date(a.date) >= jsDate;
  }))
}

var exerciseToCount = function(exercises, to){
  var jsDate = new Date(to);
  console.log(jsDate);
  return (exercises.filter(function(a){
    return new Date(a.date) <= jsDate;
  }))
}

var exerciseFromToCount = function(exercises, from, to){
  var jsFrom = new Date(from);
  var jsTo = new Date(to);
  return (exercises.filter(function(a){
    return new Date(a.date) >= jsFrom && new Date(a.date) <= jsTo;
  }))
}

exports.queryParamValidate = queryParamValidate;
exports.exerciseCount = exerciseCount;
exports.exerciseFromCount = exerciseFromCount;
exports.exerciseToCount = exerciseToCount;
exports.exerciseFromToCount = exerciseFromToCount;

  // invalid userId 1
  // valid userId only 2;
  // valid userId and limit only 3;
  // valid userId and from and limit 4;
  // valid userId and to and limit 5;
  // valid everything 6;