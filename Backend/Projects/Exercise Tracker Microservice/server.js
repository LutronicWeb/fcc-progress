// imports
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const shortid = require('shortid')

// local db schema
const db = require('./db.js')

// helper function for parsing the get query
const qHelp = require('./queryHelper.js')

// middleware
app.use(cors())

//after this, req.body contains the data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/*new user
post to /api/exercise/new-user
res.json for successful creation of new user =
{"username":"testuseridmang","_id":"BkXmn4AXQ"}
high level
check is username already exists, if it does, res = uid alreayd exists
else create new username*/
app.post('/api/exercise/new-user', function(req,res,next){
  // check if exists
  db.Person.find({username:req.body.username}).exec(function(err,data){
    if (err) return next(err);
    
    // data.length>0 means it exists
    if(data.length > 0){
      return res.json({error: 'username already exsists',
                       userid: data[0]._id})
    }
    else{
      // create new person and response
      var newPerson = new db.Person({username:req.body.username})
      var response = {username:req.body.username, _id:newPerson._id}
      newPerson.save(function(err){
        if (err) return next(err);
        return res.json(response);
      });
    };
  });
});

/* high level
 search find, edit, save, lol*/
app.post('/api/exercise/add', function(req,res,next){
  db.Person.find({_id:req.body.userId}, function(err,data){
    if (err) return next(err);
    var newExercise = {description:req.body.description,
                       duration:req.body.duration,
                       date:req.body.date}
    data[0].exercises.push(newExercise);
    data[0].save(function(err,data){
      if (err) return next(err);
      res.json({response:"successfully added"});
    });
  });
});

/*for get response (once i get here) with no limiters:
{"_id":"S1W4fSCmX","username":"123123123123","count":0,"log":[]}
userID required, if they don't put it, main fcc project based off of just responds
unknown userId
GET /api/exercise/log?{userId}[&from][&to][&limit]
                        ^required
Exercice object format:
{
    "description": "carpet laying",
    "duration": "10",
    "date": "2018-07-19"
}*/
app.get('/api/exercise/log', function(req,res,next){
  /*check is userId is a parameter in the query
  if invalid, say so
  else check the three other fields
  if JUST from date, return all exercises from that date, with number, return number
  if from date and end date, return all exercises between, with number, limit to first number*/
  /*invalid userId 1
    valid userId only 2;
    valid userId and limit only 3;
    valid userId and from only 4;
    valid userId and from and limit 5;
    valid userId and to 6;
    valid userId and to and limit 7;
    valid userId and from and to;
    valid everything 8;*/
  switch(qHelp.queryParamValidate(req.query)){
    case 1:
      res.json('invalid userId, try checking the case of userId vs userid');
      break;
    case 2:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:data[0].exercises.length,
            log:data[0].exercises
          })
        }
      })
      break;
    case 3:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          var sortedEx = qHelp.exerciseCount(data[0].exercises, req.query.limit)
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:sortedEx.length,
            log:sortedEx
          })
        }
      })
      break;
    case 4:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          console.log(typeof req.query.from);
          var sortedEx = qHelp.exerciseFromCount(data[0].exercises, req.query.from)
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:sortedEx.length,
            log:sortedEx
          })
        }
      })
      break;
    case 5:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          console.log(typeof req.query.from);
          var sortedEx = qHelp.exerciseFromCount(data[0].exercises, req.query.from);
          var sortedEx = qHelp.exerciseCount(sortedEx, req.query.limit);
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:sortedEx.length,
            log:sortedEx
          })
        }
      })
      break;
    case 6:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          console.log(typeof req.query.from);
          var sortedEx = qHelp.exerciseToCount(data[0].exercises, req.query.to);
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:sortedEx.length,
            log:sortedEx
          })
        }
      })
      break;
    case 7:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          console.log(typeof req.query.from);
          var sortedEx = qHelp.exerciseToCount(data[0].exercises, req.query.to);
          var sortedEx = qHelp.exerciseCount(sortedEx, req.query.limit);
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:sortedEx.length,
            log:sortedEx
          })
        }
      })
      break;
    case 8:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          console.log(typeof req.query.from);
          var sortedEx = qHelp.exerciseFromToCount(data[0].exercises, req.query.from, req.query.to);
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:sortedEx.length,
            log:sortedEx
          })
        }
      })
      break;
    case 9:
      db.Person.find({_id:req.query.userId}).exec(function(err,data){
        if (err) return next(err);
        if (data.length < 1) return res.json('userId not found')
        else{
          console.log(typeof req.query.from);
          var sortedEx = qHelp.exerciseFromToCount(data[0].exercises, req.query.from, req.query.to);
          var sortedEx = qHelp.exerciseCount(sortedEx, req.query.limit);
          return res.json({
            _id:req.query.userId,
            username:data[0].username,
            count:sortedEx.length,
            log:sortedEx
          })
        }
      })
      break;
    default:
      break;
  }
  
  /*if(!qHelp.userIdValidate(req.query)){
    res.json('invalid userId, try checking the case of userId vs userid');
  }
  else{
    
  }*/
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})
 
// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
