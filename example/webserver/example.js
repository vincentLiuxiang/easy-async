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


var easyAsync = require('../../index');

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


var funcs = [
  (cb) => {
    fs.readFile('./data/example1.json', (err, data) => {
      if(err) return cb(err);
      cb(null,JSON.parse(data).user);
    });
  },
  (cb,preData) => {
    console.log(preData);
    fs.readFile('./data/example2.json', (err, data) => {
      if (err) return cb(err);
      cb(null,JSON.parse(data)[preData]);
    });
  }
]

easyAsync.series(funcs,function (err,data) {
  console.log(err,data);
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






