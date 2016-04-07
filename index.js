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