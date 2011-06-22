
var
  CACHED_ELSEWHERE_PREFIX = 'Cached:',
  redis = require('redis'),
  client = redis.createClient();

//redis.debug_mode = true;

function Cache() {}

Cache.prototype.fetchKey = 
  function(key, assign_cb) {
    client.hgetall(key, assign_cb);
  };

Cache.prototype.storeKey = 
  function(key, value) {
    client.hmset(key, value, 
      function(err){
        if (typeof err !== 'undefined' && err !== null) {
          console.log('error with hmset: '+ err);
        }      
      });
  };

Cache.prototype.store = 
  function(key, obj) {
    var
      prop,
      local = {};

    for (prop in obj) {
      if (({}).hasOwnProperty.call(obj, prop)) {
        if (typeof obj[prop] === 'Array') {
          local[prop] = Cache.prototype.storeArray(obj[prop]);
        }
        else if (typeof obj[prop] === 'object') {
          if (typeof obj[prop].is_cacheable !== 'undefined') {
            obj[prop].store();
            local[prop] = obj[prop].getKey();
          }
        }
        else {
          local[prop] = obj[prop];
        }
      }
    }

    Cache.prototype.storeKey(key, local);
  };


Cache.prototype.build = 
  function(key, assign_callback) {
    // iterate over the properties
    // if you come across a 'Cached:' string value,
    // replace it with the results of fetch() called on that key
    var
      ret = {},
      prop,
      obj;
    
    Cache.prototype.fetchKey(key, 
      function(err, obj) {
        if (typeof err !== 'undefined' && err !== null) {
          console.log('error with fetchKey: '+ err);
        }
        
        for (prop in obj) {
          if (({}).hasOwnProperty.call(obj, prop)) {

            if (typeof obj[prop] === 'String'
                && obj[prop].indexOf(CACHED_ELSEWHERE_PREFIX) === 0) {
                  // recurse
                  Cache.prototype.build(
                    obj[prop].substr(CACHED_ELSEWHERE_PREFIX.length),
                    function(err, obj) {
                      ret[prop] = obj;
                    });
            }
            else if (typeof obj[prop] === 'Array') {

            }
            else {
              // normal property
              ret[prop] = obj[prop];
            }
          }
        }
        
        assign_callback(err, ret);
      });
  };

Cache.prototype.buildArray =
  function(arr, assign_callback) {
    var
      i;
    for (i=0;i<arr.lenth(); i++) {
      if (typeof arr[i] === 'String'
          && arr[i].indexOf(CACHED_ELSEWHERE_PREFIX) === 0) {
            
          
          }
      
    }
  };

Cache.prototype.storeArray = 
  function(arr) {
    var
      i,
      key,
      ret = [];

    for (i=0; i<arr.length(); i++) {
      key = arr[i].store();
      ret.push(CACHED_ELSEWHERE_PREFIX + key);
    }
    return ret;
  };

exports.Cache = Cache;