/**
 * 有限制的迭代器
 * @author @Finrila finrila@gmail.com
 * iteratorLimit([1,2,3,4,5,6,7, 8, 9, 10, 222], 3, function(next, item, index, source) {
 *   console.log(item, index, source);
 *   setTimeout(next, 1000);
 * });
 * 
 * iteratorLimit({1:4,2:78,3:323,7:24234,8:999}, 3, function(next, value, key, source) {
 *   console.log(item, key, source);
 *   setTimeout(next, 1000);
 * });
 * 
 */

module.exports = function(source, limit, loopFun) {

  if (!source || !limit || !loopFun) {
    return;
  }
  var isArray = source instanceof Array;
  var list = source;
  if (!isArray) {
    list = [];
    for (var key in source) {
      list[list.length] = key;
    }
  }
  var loop_limit = limit;
  var loop_index = 0;
  var loop_count = 0;

  loop();

  function loop() {
    if (loop_index >= list.length) {
      return;
    }
    
    var key;
    var item;
    if (isArray) {
      key = loop_index;
    } else {
      key = list[loop_index];
    }
    item = source[key];
    loop_index++;
    loop_count++;
    loopFun(function() {
      loop_count--;
      next();
    }, item, key, source);
    next();
  }

  function next() {
    if (loop_count >= loop_limit) {
      return;
    }
    loop();
  }

};