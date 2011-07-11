
var 
  $ = require('../node_modules/jquery/dist/node-jquery.js');

/**
 * Abstract superclass for model class with getters, custom setters,
 * defaults, and predefined properties.
 */
function Entity() {
    
  var
    args = Array.prototype.slice.call(arguments),
    inst_props = args.shift(), // the subclass private properties
    setters = args.shift(), // prop name -> function(value) setter
    props = args.shift(), // input prop -> value
    prop_map = args.shift(), // input prop name -> instance prop name
    instance = args.shift(), // the subclass instance if already exists
    prop, // for iteration
    setter; // for iteration

  if (typeof instance === 'undefined') {
    instance = {};
  }

  if (typeof inst_props !== 'object') {
    console.log('No instance properties!');
    return instance;
  }

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

  // add dfds representing property 'setter called' state
  for (prop in inst_props) {
    if (({}).hasOwnProperty.call(inst_props, prop)) {
      instance[prop + '_is_set'] = $.Deferred();
    }
  }
  

  // add setters
  for (setter in setters) {
    if (({}).hasOwnProperty.call(setters, setter)) {
      if (typeof setters[setter] === 'function') {
        (function(setter) { // close over each value of setter
          instance['set_' + setter] =
            function(value) {
              setters[setter](value);
              // tbd could check for undefined before below
              // (allow setters to reject)
              instance[setter + '_is_set'].resolve();
            };
        })(setter);
      }
    }
  }

  /**
   * @todo this shouldn't be public
   * @param prop string the property to add a getter for
   */
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
        //console.log(prop);
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
            // note that any property not in inst_props
            //  will still be set in this clause
            if (!({}).hasOwnProperty.call(inst_props, prop)) {
              //console.log(inst_props);
              console.log("Entity '" + instance.type + "' has no default or setter for '" + prop + "'!");
            }
            //console.log('no setter');
            inst_props[prop] = props[prop];
            //console.log(inst_props);
          }
        }
      }
    }
  }

  /**
   * @todo should this exist?
   * returns a reference to this instance's private properties
   */
  instance.getProperties = function() {
    return inst_props;
  }

  return instance;
}

exports.Entity = Entity;
