var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  fs.readFile('index.html','binary', function(err, data){
  if(err) throw err;
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data, 'binary');
    response.end();
    //console.log(new Buffer(data).toString('utf8'));
});

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
