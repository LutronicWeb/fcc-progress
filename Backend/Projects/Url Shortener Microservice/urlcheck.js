// check url
var urlCheck = function(url){
  //http(s)://www.example.com(/more/routes)
  //console.log("url check triggered")
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(url);
}

exports.urlCheck = urlCheck;