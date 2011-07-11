
var
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;

/**
 * accept an array of objects possessing Key:Value 
 * and turn it into a real object
 * @param obj
 * @param {boolean} flopped, optionally reverse key<->value
 */
function normalize(obj, flopped) {
  var
    res = {}, // push results into here
    c; // for iteration

  if (typeof flopped === 'undefined') {
    for(c in obj) {
      res[obj[c].Key] = obj[c].Value;
    }
  }
  else { // flopped
    for(c in obj) {
      res[obj[c].Value] = obj[c].Key;
    }    
  }
  return res;
}

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
      'AllWeaponsById': function(value) {
        properties.AllWeaponsById = normalize(value);
      },
      'AllMapsById': function(value) {
        properties.AllMapsById = normalize(value);
      },
      'AllEnemiesById': function(value) {
        properties.AllEnemiesById = normalize(value);
      },
      'AllReachPlaylists': function(value) {
        properties.AllReachPlaylists = normalize(value);
      },
      'AllCommendationsById': function(value) {
        properties.AllCommendationsById = normalize(value);
      },
      'PlayerColorsByIndex': function(value) {
        properties.PlayerColorsByIndex = normalize(value);
      },
      'GameVariantClassesKeysAndValues': function(value) {
        properties.GameVariantClassesKeysAndValues = normalize(value, true);
      },
      'AllMedalsById': function(value) {
        properties.AllMedalsById = normalize(value);
      }
    },
    instance = {};

  instance.type = 'Metadata';
  instance.id = 0;
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
  return instance;
}

exports.Metadata = Metadata;