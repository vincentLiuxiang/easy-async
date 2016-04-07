# easyasync

### 简单的控制异步方法同步调用的模块，前后端均可用。
easyasync包含串行series和并行parallel两种模式，总代码45行。非常简单，有兴趣的用户可基于此自行修改。

#### 安装
```
npm install easyasync
```
#### 使用
```
easyAsync = require('easyasync');

easyAsync.series(
 [
   func1(cb){
     ...
   },
   func2(cb){
     ...
   } 
   ...
 ]
 [,callback]
)

callback可选
```
#### 回调多嵌套

```
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

```

#### easyasync : series模式

```
var easyAsync = require('../../index.js');
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
  // 返回data数组，data按funcs函数顺序排序。
  console.log(err,data,user,money);
});

```
* cb(null,data) 调用funcs的下一个function
* cb(err) 忽略funcs剩下function，进入 easyAsync.series(funcs [,callback]) callback;

#### easyasync : parallel模式

```
var easyAsync = require('../../index.js');
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
  // 返回data数组，data按funcs函数顺序排序。
  console.log(err,data);
});

```

#### easyasync 源码

```
var Async = function () {}

var sync = function (funcs,cbData,callback) {
  if(!funcs.length){
    return callback&&callback(null,cbData);
  }
  funcs.shift()(function (err,data) {
    callback&&cbData.push(data);
    if(err){
      return callback&&callback(err,cbData);
    }
    sync(funcs,cbData,callback);
  });
}

Async.prototype.series = function (funcs,callback) {
  var data = [];
  sync(funcs,data,callback);
}

Async.prototype.parallel = function (funcs,callback) {
  var funcNum = funcs.length;
  var cbDataTmp = 0;
  var cbData = [];
  for(var funcIndex in funcs){
    var Func = funcs[funcIndex];
    (function (funcIndex) {
      Func(function (err,data) {
        if(callback){
          if(err){
            cbData[funcIndex] = data;
            return callback(err,cbData);
          }
          cbDataTmp++;
          cbData[funcIndex] = data;
          if(cbDataTmp === funcNum){
            return callback(null,cbData);
          }
        }
      })
    })(funcIndex);
  }
}

module.exports = new Async();

```