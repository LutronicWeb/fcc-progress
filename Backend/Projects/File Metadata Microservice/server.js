'use strict';

var express = require('express');
var cors = require('cors');
var multer = require('multer');
console.log(1);
var upload = multer();

// require and use "multer"...

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

// multer notes:
// upload.single is multer middleware
// parameter 'upfile' is name field in html element for upload
/*
{ fieldname: 'upfile',
  originalname: 'asdasd.txt',
  encoding: '7bit',
  mimetype: 'text/plain',
  destination: 'uploads',
  filename: '358cae40d79c92cde1d5f0fcffacfcfb',
  path: 'uploads/358cae40d79c92cde1d5f0fcffacfcfb',
  size: 0 }*/
app.post('/api/fileanalyse', upload.single('upfile'), function(req,res){
  if (req.file == undefined){
    res.json('no file selected');
  }
  else{
    res.json({
      name:req.file.originalname,
      type:req.file.mimetype,
      size:req.file.size
    })
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
