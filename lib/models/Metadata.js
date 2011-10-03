
var
  $ = require('jquery'),
  BASE_DIR = require('../../lib/config.js').BASE_DIR,
  normalize_array = require(BASE_DIR+'lib/util.js').normalize_array,
  CacheableEntity = require(BASE_DIR+'lib/types/CacheableEntity.js').CacheableEntity;

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

  /**
   * @returns {Array} names all map names
   */
  instance.getAllMapNames = function() {

    var
      maps,
      id, // for iteration
      names = []; // return array

    maps = instance.get_AllMapsById();

    for (id in maps) {
      if (({}).hasOwnProperty.call(maps, id)) {
        names.push(maps[id].Name);
      }
    }

    return names;
  }

  /**
   * @returns {Array} names all map names
   */
  instance.getAllPlaylistNames = function() {

    var
      playlists,
      id, // for iteration
      names = []; // return array


    playlists = instance.get_AllReachPlaylists();

    for (id in playlists) {
      if (({}).hasOwnProperty.call(playlists, id)) {
        names.push(playlists[id].Name);
      }
    }

    return names;
  }

  return instance;
}




exports.Metadata = Metadata;