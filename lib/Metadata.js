
var
  normalize_array = require('../lib/util.js').normalize_array,
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;

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