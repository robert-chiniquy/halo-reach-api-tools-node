
var
  REDIS_DB = require('../../lib/config.js').REDIS_DB,
  $ = require('jquery/dist/node-jquery.js'),
  redis = require('redis'),
  client = redis.createClient(),
  CACHED_ELSEWHERE_PREFIX = 'Cached:';


//redis.debug_mode = true;

function Cache() {};

/**
 * Uses HGETALL to get an object as a hash
 * @param key string
 * @param assign_cb function(err, obj)
 * @returns dfd $.Deferred representing the completion of the read
 */
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

/**
 * Uses HMSET to set all of a hash's values to match the passed object
 * @param key string
 * @param value object
 */
Cache.prototype.storeKey = 
  function(key, value) {
    if (typeof key === 'undefined') {
      console.log('hmset: undefined key!');
      return;
    }
    if (typeof value === 'undefined') {
      console.log('hmset: undefined value!')
    }
    client.hmset(key, value,
      function(err){
        if (typeof err !== 'undefined' && err !== null) {
          console.log('error with hmset: '+ err);
        }      
      });
//    console.log(value);
  };

/**
 * Uses EXPIRE to set the TTL of the key
 * @param key string
 * @param ttl number
 */
Cache.prototype.expire = 
  function(key, ttl) {
    client.expire(key, ttl);
  };

/** uses TTL to return the time-to-live on a key
 * @param {string} key
 * @param {function} assign_cb(err, obj)
 */
Cache.prototype.ttl = 
  function(key, assign_cb) {
    client.ttl(key, assign_cb);
  }

/**
 * Stores the object as a hash, translating any CacheableEntity properties
 * and any arrays of CacheableEntity
 * @param key string
 * @param obj object whose properties are either primitive, CacheableEntity, or
 *            array of CacheableEntity
 */
Cache.prototype.store = 
  function(key, obj) {
    var
      prop,
      tmp_key,
      local = {};

//    console.log('storing '+ key);
//    console.log(obj);

    for (prop in obj) {
      if (({}).hasOwnProperty.call(obj, prop)) {
        if (typeof obj[prop] === 'Array') {
          local[prop] = Cache.prototype.storeArray(obj[prop]);
        }
        else if (typeof obj[prop] === 'object') {
          if (obj[prop] !== null 
            && typeof obj[prop].is_cacheable !== 'undefined') {
              obj[prop].store();
              local[prop] = obj[prop].getKey();
          }
          else if (obj[prop] !== null) {
            tmp_key = key + ':' + prop
            Cache.prototype.store(tmp_key,obj[prop]);
            local[prop] = CACHED_ELSEWHERE_PREFIX + tmp_key;
            
//            console.log('uncacheable property: "' + tmp_key + '"!');

          }
          else {
            // null property
          }
        }
        else {
          local[prop] = obj[prop];
        }
      }
    }
    
//    console.log(local);

    Cache.prototype.storeKey(key, local);
  };

/**
 * @param {string} key
 * @param {function} assign_callback function(err, obj)
 * @returns dfd $.Deferred which will reflect the total completion of the read
 */
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
    
    // fetchKey uses HGETALL
    Cache.prototype.fetchKey(key, 
      function(err, obj) {
        
        if (typeof err !== 'undefined' && err !== null) {
          console.log('error with fetchKey: '+ err);
        }
        
        for (prop in obj) {
          if (({}).hasOwnProperty.call(obj, prop)) {

            if (typeof obj[prop] === 'string'
                && obj[prop].indexOf(CACHED_ELSEWHERE_PREFIX) === 0) {
                  (function(prop) {
                    // recurse
                    var
                      tmp_key = obj[prop].substr(CACHED_ELSEWHERE_PREFIX.length),
                      dfd_q = $.Deferred();
                      
                    request_queue.push(dfd_q);

                    $.when(
                      Cache.prototype.build(
                        tmp_key,
                        function(err, obj) {
                          ret[prop] = obj;
                        }
                      )  
                    ).done(function() {
                      dfd_q.resolve(); 
                    });
                  })(prop);                  
            }
            else if (Object.prototype.toString.call(obj).slice(8, -1) === 'Array') {
              (function(prop){
                var
                  dfd_q = $.Deferred();
                  
                request_queue.push(dfd_q);
                
                $.when(  
                  Cache.prototype.buildArray(
                    obj[prop], 
                    function(err, obj) {                    
                      ret[prop] = obj;       
                    })
                ).done(function() {
                  dfd_q.resolve();                    
                });
                
              })(prop);
            }
            else {
              // normal property
              ret[prop] = obj[prop];
            }
          }
        }

    
      $.when.apply($, request_queue)
        .done(
          function() {
            assign_callback(undefined, ret);     
            dfd.resolve();
          });
      });
    
    return dfd;
  };

/**
 * @param arr array of cache key reference strings
 * @param assign_callback function(err, obj) to pass the finished array to
 * @returns dfd $.Deferred representing the completion of the read
 */
Cache.prototype.buildArray =
  function(arr, assign_callback) {
    var
      dfd = $.Deferred(),
      i;
      
    for (i=0;i<arr.length; i++) {
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

/**
 * @param arr the array to store
 * @returns ret array of cache key reference strings
 */
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

/**
 * Uses EXIST to check for the existence of the key
 * @param key string
 * @param assign_callback function(err, obj) to pass result to
 */
Cache.prototype.exists =
  function(key, assign_callback) {
    client.exists(key, assign_callback);
  }

/**
 * FLUSHALL on redis clears the entire cache, every db
 * Probably don't want to call this
 */
Cache.prototype.flushall = 
  function() {
    client.flushall();
  }

/**
 * FLUSHDB on redis clears the current db
 */
Cache.prototype.flushdb = 
  function() {
    client.flushdb();
  }

/**
 * @param db number redis database number to use
 */
Cache.prototype.select =
  function(db) {
    client.select(db);
  }

// immediately queue select for default db
Cache.prototype.select(REDIS_DB);


exports.Cache = Cache;