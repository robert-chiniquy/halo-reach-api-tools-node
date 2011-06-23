
var 
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Entity = require('../lib/Entity.js').Entity,
  Cache = require('../lib/Cache.js').Cache;

/**
 * Abstract, adds Redis caching to entities
 * 
 */
function CacheableEntity() {

  var
    args = Array.prototype.slice.call(arguments),
    instance = args.shift(),
    inst_props = args.shift(),
    setters = args.shift(),
    props = args.shift(), // input prop -> value
    prop_map = args.shift(); // input prop name -> instance prop name


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

  function getKey() {
    return instance.type + ':' + instance.id;
  }

  function store() {
    var 
      key = getKey();
    
    Cache.prototype.store(key, instance.getProperties());
    if (typeof instance.ttl !== 'undefined') {
      Cache.prototype.expire(key, instance.ttl);
    }
    return key;
  }

  function fetch() {
    var
      dfd = $.Deferred();
    
    Cache.prototype.exists(getKey(),
      function(err, obj) {
        if (obj === 1) {
          Cache.prototype.build(getKey(), 
            function(err, obj) {

              if (typeof err !== 'undefined' && err !== null) {
                console.log('error during fetch');
                console.log(err); // tbd: mark an error on the object
              }

              load(obj);
              dfd.resolve();
            });          
        }
        else {
          // object doesn't exist in cache
          instance.cache_miss = true; // tbd: real errors & validation
          dfd.resolve();
        }
      }
    ); 
    
    return dfd;
  }
  
  function load(props) {
    
    Entity(inst_props, setters, props, prop_map, instance);

    instance.fetch = fetch;
    instance.store = store;
        
    return instance;
  }
  
  return load(inst_props);
}

exports.CacheableEntity = CacheableEntity;
