'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var urlCheck = require('./urlcheck.js')
var app = express();
var mongoose = require('mongoose').set('debug', true);
var dns = require('dns');
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

// Basic Configuration 
var port = process.env.PORT || 3000;

var urlSchema = new mongoose.Schema({
  original_url: {type:String,required:true},
  short_url: {type:Number,required:true}
});

//  shUrl is a short url
var Short = mongoose.model('Short',urlSchema);

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new', function (req, res, next) {
  // urlcheck is just a long regex for http(s)://www.example.domain/path
  // stored in seperate file
  // regex check the format
  if (!urlCheck.urlCheck(req.body.url)){
    res.json({'error':'invalid url'});
  }
  // else do dns lookup
  else{
    dns.lookup(req.body.url.replace(/(^\w+:|^)\/\//, ''), function(err, address, family){
      if(err){
        res.json({'error':'invalid url'})}
      else{
        Short.find({original_url:req.body.url}).exec(function(err,data){
          if (err) return next(err);
          // if data exists (length > 0), just return the record
          console.log(data);
          if(data.length > 0){
            return res.json({original_url:data[0].original_url,short_url:data[0].short_url})
          }
          // if it don't exist, check records in db and make a new record with shortUrl
          // as data.length+1
          else{
            Short.find({}).exec(function(err,data){
              if (err) return next(err)
              var shUrlJson = {original_url:req.body.url, short_url:data.length+1};
              var shorty = new Short(shUrlJson);
              shorty.save(function(err){
                if (err) return next(err)
                return res.json(shUrlJson);
              });
            });
          };
        });
      };
    });
  };
});

app.get('/api/shorturl/:num', function(req,res){
  Short.find({short_url:req.params.num}).exec(function(err,data){
    res.redirect(data[0].original_url);
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});