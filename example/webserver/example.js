var fs = require('fs');

fs.readFile('./data/example1.json', (err, data) => {
  if (err) throw err;
  var user = JSON.parse(data).user;
  fs.readFile('./data/example2.json', (err, data) => {
    if (err) throw err;
    var money = JSON.parse(data)[user];
    console.log(user,'has $',money);
  });
});

var easyAsync = require('../../index.js');

var funcs = [
  (cb) => {
    console.log(1);
    cb(null);
  },
  (cb) => {
    console.log(2);
    cb(null);
  }
]
easyAsync.series(funcs);


var user  = null;
var money = 0 ;

var funcs = [
  (cb) => {
    fs.readFile('./data/example1.json', (err, data) => {
      if(err) return cb(err);
      user = JSON.parse(data).user;
      cb(null,JSON.parse(data).user);
    });
  },
  (cb) => {
    fs.readFile('./data/example2.json', (err, data) => {
      if (err) return cb(err);
      money = JSON.parse(data)[user];
      cb(null,money);
    });
  }
]

easyAsync.series(funcs,function (err,data) {
  console.log(err,data,user,money);
});


var funcs = [
  (cb) => {
    fs.readFile('./data/example1.json', (err, data) => {
      if(err) return cb(err);
      var data = JSON.parse(data);
      console.log(data);
      cb(null,data);
    });
  },
  (cb) => {
    fs.readFile('./data/example2.json', (err, data) => {
      if (err) return cb(err);
      var data = JSON.parse(data);
      console.log(data);
      cb(null,data);
    });
  }
]

easyAsync.parallel(funcs,function (err,data) {
  console.log(err,data);
});






