var Async = function () {}

var sync = function (funcs,cbData,predata,callback) {
  if(!funcs.length){
    return callback&&callback(null,cbData);
  }
  funcs.shift()((err,data) => {
    callback&&cbData.push(data);
    if(err){
      return callback&&callback(err,cbData);
    }
    sync(funcs,cbData,data,callback);
  },predata);
}

Async.prototype.series = function (funcs,callback) {
  var data = [];
  sync(funcs,data,null,callback);
}

Async.prototype.parallel = function (funcs,callback) {
  var funcNum = funcs.length;
  var cbDataTmp = 0;
  var cbData = [];
  for(let funcIndex in funcs){
    var Func = funcs[funcIndex];
    Func((err,data) => {
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
  }
}

module.exports = new Async();