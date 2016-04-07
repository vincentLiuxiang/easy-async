var http = require('http');
var postData = JSON.stringify({aaa:1000});

var option = {
  hostname: 'localhost',
  port: 3000,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

var req = http.request(option,function (res) {
  console.log(res.headers);

  var chunks = [];

  res.on('data', (chunk) => {
    chunks.push(chunk);
  });

  res.on('end', () => {
    console.log(Buffer.concat(chunks).toString());
  });

})

req.on('error', (e) => {
  console.log(`problem with request: ${e}`);
});

req.setTimeout(10000,() => {
  console.log('time out!');
  req.abort();
});

req.write(postData);
req.end();