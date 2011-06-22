
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
    return key;
  }

  function fetch() {
    var
      dfd = $.Deferred();
    
    Cache.prototype.build(getKey(), 
      function(err, obj) {
        load(obj);
        console.log('after load:');
        console.log(instance);
        dfd.resolve();
      });
    
    return dfd;
  }
  
  function load(inst_props) {
    Entity(inst_props, setters, props, prop_map, instance);

    instance.fetch = fetch;
    instance.store = store;
    
    console.log(instance);
    
    return instance;
  }
  
  return load(inst_props);
}

exports.CacheableEntity = CacheableEntity;
