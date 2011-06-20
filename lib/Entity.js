

/**
 * Abstract superclass for model class with getters, custom setters,
 * defaults, and predefined properties.
 */
function Entity() {
    
  var
    instance = {},
    args = Array.prototype.slice.call(arguments),
    inst_props = args.shift(),
    setters = args.shift(),
    props = args.shift(), // input prop -> value
    prop_map = args.shift(), // input prop name -> instance prop name
    prop,
    setter;

  /*
  console.log('inst_props');
  console.log(inst_props);
  console.log('setters');
  console.log(setters);
  console.log('props');
  console.log(props);
  console.log('prop_map');
  console.log(prop_map);
  */

  if (typeof inst_props !== 'object') {
    console.log('No instance properties!');
    return instance;
  }
  
  // add setters
  for (setter in setters) {
    if (({}).hasOwnProperty.call(setters, setter)) {
      if (typeof setters[setter] === 'function') {
        (function() { // close over each value of setter
          instance['set_' + setter] = setters[setter];
        })();
      }
    }
  }
  
  instance.add_getter = 
    function(prop) {
      instance['get_' + prop] = 
        function() {
          return inst_props[prop];
        };
    };
  
  // add getters
  for (prop in inst_props) {
    if (({}).hasOwnProperty.call(inst_props, prop)) {
      instance.add_getter(prop);
    } 
  }

  // assign values    
  for (prop in props) {
    if (({}).hasOwnProperty.call(props, prop)) {
      if (typeof props[prop] !== 'undefined') {        
        // If there is a prop map that has this property, 
        // and the input prop map name is not also a valid property name
        if (typeof prop_map !== 'undefined' 
          && typeof prop_map[prop] !== 'undefined'
          && typeof inst_props[prop_map[prop]] === 'undefined') {
            //console.log('using prop map');
            if (typeof setters !== 'undefined' && typeof setters[prop_map[prop]] === 'function') {
              //console.log('using setter');
              setters[prop_map[prop]].call(instance, props[prop]);
            }
            else {// no setter      
              //console.log('no setter');
              inst_props[prop_map[prop]] = props[prop];          
            }
        }
        else { // no prop mapping
          //console.log('no prop map');
          if (typeof setters !== undefined && typeof setters[prop] === 'function') {
            //console.log('using setter');
            setters[prop].call(instance, props[prop]);
          }
          else { //no setter
            //console.log('no setter');
            inst_props[prop] = props[prop];
          }
        }
      }
    }
  }
  
  instance.prototype = Entity.prototype;
  return instance;
}

exports.Entity = Entity;
