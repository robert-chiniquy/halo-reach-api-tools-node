
var
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;

/**
 * accept an array of objects possessing {Key: .., Value: ..} 
 * and turn it into a real object
 * @param {array} obj
 * @param {boolean} flopped, optionally reverse key<->value
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
 * @todo - have setter for GlobalRanks index by id?
 */
function Metadata(props, prop_map) {
  var
    properties = {
      'CurrentArenaSeason': undefined,
      'AllReachPlaylists': undefined,
      'AllCommendationsById': undefined,
      'AllEnemiesById': undefined,
      'AllMapsById': undefined,
      'AllMedalsById': undefined,
      'AllWeaponsById': undefined,
      'GameVariantClassesKeysAndValues': undefined,
      'GlobalRanks': undefined,
      'GlobalRanksById': undefined,
      'PlayerColorsByIndex': undefined
    },
    setters = {
      'CurrentArenaSeason': function(value) {
        properties.CurrentArenaSeason = +value;
      },
      'AllReachPlaylists': function(value) {
        properties.AllReachPlaylists = normalize_array(value);
      },
      'AllWeaponsById': function(value) {
        properties.AllWeaponsById = normalize_array(value);
      },
      'AllMapsById': function(value) {
        properties.AllMapsById = normalize_array(value);
      },
      'AllEnemiesById': function(value) {
        properties.AllEnemiesById = normalize_array(value);
      },
      'AllCommendationsById': function(value) {
        properties.AllCommendationsById = normalize_array(value);
      },
      'PlayerColorsByIndex': function(value) {
        properties.PlayerColorsByIndex = normalize_array(value);
      },
      'GameVariantClassesKeysAndValues': function(value) {
        properties.GameVariantClassesKeysAndValues = normalize_array(value, true);
      },
      'AllMedalsById': function(value) {
        properties.AllMedalsById = normalize_array(value);
      }
    },
    instance = {};

  instance.type = 'Metadata';
  instance.id = 0;
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
  return instance;
}

exports.Metadata = Metadata;