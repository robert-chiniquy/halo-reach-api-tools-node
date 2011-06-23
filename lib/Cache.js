
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  redis = require('redis'),
  client = redis.createClient(),
  CACHED_ELSEWHERE_PREFIX = 'Cached:';


//redis.debug_mode = true;

function Cache() {}

Cache.prototype.fetchKey = 
  function(key, assign_cb) {
    var 
      dfd = $.Deferred();
      
    client.hgetall(key, 
      function(err, value) {
        assign_cb(err, value);
        dfd.resolve();
      });
      
    return dfd;
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

Cache.prototype.expire = 
  function(key, ttl) {
    client.expire(key, ttl);
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
      dfd = $.Deferred(),
      request_queue = [],
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
                  (function() {
                    // recurse
                    var
                      dfd_q = new Deferred();
                      
                    request_queue.push(dfd_q);
                    
                    $.when(
                      Cache.prototype.build(
                        obj[prop].substr(CACHED_ELSEWHERE_PREFIX.length),
                        function(err, obj) {
                          ret[prop] = obj;
                        }
                      )  
                    ).done(function() {
                       dfd_q.resolve(); 
                    });
                  })();                  
            }
            else if (typeof obj[prop] === 'Array') {
              Cache.prototype.buildArray(
                obj[prop], 
                function(err, obj) {                    
                  ret[prop] = obj;
                  
                });
            }
            else {
              // normal property
              ret[prop] = obj[prop];
            }
          }
        }
        
        assign_callback(err, ret);
      });
    
    $.when.apply($, request_queue)
      .done(
        function() {
          dfd.resolve();
        });
    
    return dfd;
  };

Cache.prototype.buildArray =
  function(arr, assign_callback) {
    var
      dfd = $.Deferred(),
      i;
      
    for (i=0;i<arr.lenth(); i++) {
      if (typeof arr[i] === 'String'
        && arr[i].indexOf(CACHED_ELSEWHERE_PREFIX) === 0) {
          Cache.prototype.build(arr[i].substr(CACHED_ELSEWHERE_PREFIX.length), 
            function(err, obj) {
              assign_callback(err, obj);
              dfd.resolve();
            }
          );
      }
    }
    return dfd;
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

Cache.prototype.flushall = 
  function() {
    client.flushall();
  }

exports.Cache = Cache;