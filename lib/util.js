


/**
 * accept an array of objects possessing {Key: .., Value: ..} 
 * and turn it into {key1: value1, key2: value2, ...}
 * @param {array} obj
 * @param {boolean} flopped, optionally swap key<->value
 * @return {object} res
 * @todo consider doing reverse indexes also?
 */
function normalize_array(obj, flopped) {
  var
    res = {}, // push results into here
    i; // for iteration

  if (Object.prototype.toString.call(obj).slice(8, -1) !== 'Array') {
    // not an array, return unchanged
//    console.log(Object.prototype.toString.call(obj).slice(8, -1));
    return obj;
  }

  if (typeof flopped === 'undefined') {
    for(i=0; i<obj.length; i++) {
      res[obj[i].Key] = obj[i].Value;
    }
  }
  else { // flopped
    for(i=0; i<obj.length; i++) {
      res[obj[i].Value] = obj[i].Key;
    }    
  }
  return res;
}

/**
 * accept an array of objects possessing {Key: .., Value: ..} 
 * and an index to translate the keys with
 * and turn it into {index_key_1: value1, index_key_2: value2, ...}
 * 
 * @param {Array} obj
 * @param {object} index
 * @param {function} index_filter_func(index_value) maps values to property names
 * @return {object} res
 */
function normalize_by_index(obj, index, index_filter_func) {
  
  var
    key,
    i, // for iteration
    res = {}; // return object

//  console.log(obj);
//  console.log(index);

  if (Object.prototype.toString.call(obj).slice(8, -1) !== 'Array') {
    // not an array, return unchanged
    return obj;
  }

  for(i=0; i<obj.length; i++) {
    if (typeof index[obj[i].Key + ''] !== 'undefined') {
      key = index_filter_func(index[obj[i].Key]);
    }
    else {
      key = obj[i].Key;
    }
    res[key] = obj[i].Value;    
  }
   
//  console.log(res);
   
  return res;
}


exports.normalize_by_index = normalize_by_index;
exports.normalize_array = normalize_array;