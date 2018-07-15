// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}))
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/timestamp/:date_string?', function(req,res){
  // value of the date
  var dateVal = null;

  // if date string empty, make date at current time
  // else make date with params
  if(req.params.date_string == undefined){
    dateVal = new Date();
  }
  else{
    // req is string
    // if req is in format 2015-12-01 make new date
    // else, convert to int and the make new date
    // (the other format of date is an int)
    // if you new Date a number string ("123123"), it's invalid
    if(/-/.test(req.params.date_string)){
      dateVal = new Date(req.params.date_string);
    }
    else{
      dateVal = new Date(parseInt(req.params.date_string));
    }
  }
  
  // json to respond
  var dateJSON = {"unix": "",
                  "utc": ""}
  
  // if invalid, send error
  // else send timestamp
  // NOTE: so date val == invalid date, but 
  // if I assign datejson.utc = dateval, the
  // response is null instead of invalid date?
  if (dateVal == "Invalid Date"){
    console.log("error")
    dateJSON.unix = null;
    dateJSON.utc = "Invalid Date";
  }
  else{
    dateJSON.unix = dateVal.getTime();
    dateJSON.utc = dateVal.toUTCString();
  }
  console.log(req.params);
  res.json(dateJSON);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});