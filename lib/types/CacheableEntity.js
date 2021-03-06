
var 
  $ = require('jquery'),
  BASE_DIR = require('../../lib/config.js').BASE_DIR,  
  Entity = require('./Entity.js').Entity,
  Cache = require(BASE_DIR+ 'lib/services/Cache.js').Cache;

/**
 * Abstract, adds Redis caching to entities
 * 
 */
function CacheableEntity() {

  var
    args = Array.prototype.slice.call(arguments),
    instance = args.shift(), // the subclass
    inst_props = args.shift(), // the subclass properties to close over
    setters = args.shift(), // prop name -> function(value) setter
    props = args.shift(), // input prop -> value
    prop_map = args.shift(); // input prop name -> instance prop name

  /**
   * @returns unique key for this entity
   */
  function getKey() {
    return instance.type + ':' + instance.id;
  }

  /**
   * @param {function} assign_cb(err, obj) called with the time to live 
   */
  function getTtl(assign_cb) {
    Cache.ttl(instance.getKey(), assign_cb);
  }

  /**
   * Stores the instance properties in cache, optionally sets ttl
   * @todo verify expire is always sent after the store
   * @returns string key for this entity
   */
  function store() {
    var 
      key = instance.getKey();
    
    Cache.store(key, instance.getProperties());
    if (typeof instance.ttl !== 'undefined') {
      Cache.expire(key, instance.ttl);
    }
    return key;
  }

  /**
   * returns $.Deferred representing the completion of the read
   */
  function fetch() {
    var
      dfd = $.Deferred();

    Cache.exists(instance.getKey(),
      function(err, obj) {
        if (obj === 1) {
          $.when(
            Cache.build(instance.getKey(), 
              function(err, obj) {

                if (typeof err !== 'undefined' && err !== null) {
                  console.log('error during fetch');
                  console.log(err); // tbd: mark an error on the object
                }

//                console.log('key = ' + getKey());
//                console.log(obj);

                load(obj);
//                console.log(instance.getProperties());
              })

          ).done(function() {
            dfd.resolve();                
          });            
        }
        else {
          // object doesn't exist in cache
          //console.log('(1) cache miss on '+ instance.getKey());
          if (typeof err !== 'undefined' && err !== null) {
            console.log(' error during fetch');
            console.log(err); // tbd: mark an error on the object
          }
          
          instance.cache_miss = true; // tbd: real errors & validation
          dfd.fail();
        }
      }
    ); 
    
    return dfd;
  }

  /**
   * Called to load properties for this entity from cache
   * 
   * @param props the properties to load
   * @returns a reference to the entity
   */
  function load(props) {

    //if (instance.type === 'PlayerStats') {
      //console.log('loading');
      //console.log(props);
    //}

    Entity(inst_props, setters, props, prop_map, instance);

    instance.fetch = fetch;
    instance.store = store;
    instance.getTtl = getTtl;
    instance.getKey = getKey;

    if (typeof instance.type === 'undefined') {
      console.log('No type!');
      return false;
    }

    if (typeof instance.id === 'undefined') {
      console.log("Field 'id' required for caching for "+ instance.type +"!");
      //console.log(instance.getProperties());
      return false;
    }

    if (typeof instance.getProperties !== 'function') {
      console.log('No getProperties method!');
      return false;
    }

    return instance;
  }
  
  return load(props);
}

exports.CacheableEntity = CacheableEntity;
