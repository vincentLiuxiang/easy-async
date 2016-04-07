var http  = require('http');
var port  = 3000;
var count = 0;

var app   = http.createServer(function (req,res) {
  setTimeout(() => {
    count++;
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    res.end(JSON.stringify({reqCount:count}));
  }, 3000);

});

app.listen(port,function () {
  console.log(`web server listening on ${port}`);
})
