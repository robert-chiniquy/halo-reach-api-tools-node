
var 
  CACHED_ELSEWHERE_PREFIX = 'Cached:',
  redis = require('redis'),
  client = redis.createClient();



redis.debug_mode = true;
/*
client.on("connect", function () {
  console.log("Redis connected.");
});

client.on("ready", function () {
  console.log("Redis ready.");
});

client.on("error", function () {
  console.log("redis error");
});
*/

function Cache() {}

Cache.prototype.fetchKey = 
  function(key) {
    var
      res = client.hgetall(key, 
        function(err, obj) {
          console.log('error during fetch');
          console.log(err); // tbd
          console.log(obj);
        });
    return res;
  };

Cache.prototype.storeKey = 
  function(key, value) {
    if (!client.connected) {
      console.log('client not connected!');
    }
    client.hmset(key, value);
  };

Cache.prototype.build = 
  function(key) {
    // iterate over the properties
    // if you come across a 'Cached:' string value,
    // replace it with the results of fetch() called on that key
    var
      ret = {},
      prop,
      obj = Cache.prototype.fetchKey(key);

    for (prop in obj) {
      if (({}).hasOwnProperty.call(obj, prop)) {

        if (typeof obj[prop] === 'String'
            && obj[prop].indexOf(CACHED_ELSEWHERE_PREFIX) === 0) {
              // recurse
              ret[prop] = Cache.prototype.build(obj[prop].substr(CACHED_ELSEWHERE_PREFIX.length));
        }
        else if (typeof obj[prop] === 'Array') {

        }
        else {
          // normal property
          ret[prop] = obj[prop];
        }
      }
    }
    return ret;
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


/**
 * Abstract superclass, provides Redis caching
 */
function Cacheable(instance) {

  if (typeof instance.id === 'undefined') {
    console.log('No id!');
    return false;
  }

  if (typeof instance.type === 'undefined') {
    console.log('No type!');
    return false;
  }

  if (typeof instance.getProperties !== 'function') {
    console.log('No getProperties method!');
    return false;
  }

  if (client.connected === false) {
    console.log('Warning: not connected to Redis');
  }

  function getKey() {
    return instance.type + ':' + instance.id;
  }

  function fetch() {
    return Cache.prototype.build(getKey());
  }

  function store() {
    var 
      key = getKey();
    Cache.prototype.store(key, instance.getProperties());
    return key;
  }

  instance.fetch = fetch;
  instance.store = store;

  instance.is_cacheable = true;

  return instance;
}

exports.Cache = Cache;
exports.Cacheable = Cacheable;
exports.redis = redis;
exports.redis_client = client;
