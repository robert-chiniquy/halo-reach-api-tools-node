

var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;

/**
 * accept an array of objects possessing {Key: .., Value: ..} 
 * and an index to translate the keys with
 * and turn it into {index_key_1: value1, index_key_2: value2 ...}
 * 
 * @param {Array} obj
 * @param {object} index
 * @param {function} index_filter_func(index_value) maps values to property names
 * @return {object} res
 */
function normalize_by_index(obj, index, index_filter_func) {
  
  var
    key,
    i, // for iteration
    res = {}; // return object

//  console.log(obj);
//  console.log(index);

  if (Object.prototype.toString.call(obj).slice(8, -1) !== 'Array') {
    // not an array, return unchanged
    return obj;
  }

  for(i=0; i<obj.length; i++) {
    if (typeof index[obj[i].Key + ''] !== 'undefined') {
      key = index_filter_func(index[obj[i].Key]);
    }
    else {
      key = obj[i].Key;
    }
    res[key] = obj[i].Value;    
  }
   
//  console.log(res);
   
  return res;
}

/**
 * @todo the way gamertag works is weird
 */
function PlayerStats(gamertag, metadata, props, prop_map) {
  var
    properties = {
      'HopperId': undefined,
      'MapId': undefined,
      'VariantClass': undefined,
      'DeathsByDamageType': undefined,
      'PointsByDamageType': undefined,
      'KillsByDamageType': undefined,
      'game_count': undefined,
      'total_assists': undefined,
      'total_betrayals': undefined,
      'total_deaths': undefined,
      'total_first_place': undefined,
      'total_wins': undefined,
      'total_kills': undefined,
      'biggest_kill_points': undefined,
      'biggest_kill_streak': undefined,
      'highest_game_kills': undefined,

      'DeathsByEnemyTypeClass': undefined, 
      'KillsByEnemyTypeClass': undefined,
      'PointsByEnemyTypeClass': undefined, 
      'MedalChestCompletionPercentage': undefined, // decimal
      'MedalCountsByType': undefined, // object
      'TotalMedals': undefined,
      'game_difficulty': undefined,
      'high_score': undefined,
      'high_score_coop': undefined,
      'high_score_solo': undefined,
      'season_id': undefined,
      'total_score': undefined,
      'total_top_half_place': undefined,
      'total_top_third_place': undefined,
      'total_playtime': undefined,
      'highest_set': undefined,
      'highest_skull_multiplier': undefined,
      'total_enemy_players_killed': undefined,
      'total_generators_destroyed': undefined,
      'total_missions_beating_par': undefined,
      'total_missions_not_dying': undefined,
      'total_score_coop': undefined,
      'total_score_solo': undefined,
      'total_waves_completed': undefined      
    },
    setters = {
      'HopperId': function(value) {
        properties.HopperId = +value;
        instance.type = instance.type + ':byPlaylist';
        instance.id = 
          instance.gamertag + ':' + 
            metadata.get_AllReachPlaylists()[properties.HopperId];
      },
      'MapId': function(value) {
        properties.MapId = +value;
        instance.type = instance.type + ':byMap';
        instance.id = 
          instance.gamertag + ':' + 
            metadata.get_AllMapsById()[properties.MapId];     
      },
      'VariantClass': function(value) {
        properties.VariantClass = 
          metadata.get_GameVariantClassesKeysAndValues()[value];
      },
      'DeathsByDamageType': function(value) {
        properties.DeathsByDamageType = 
          normalize_by_index(value, metadata.get_AllWeaponsById(), 
            function(index_obj) {
              return index_obj.Name.split(' -', 1)[0];
            }
          );
      },
      'KillsByDamageType': function(value) {
        properties.KillsByDamageType = 
          normalize_by_index(value, metadata.get_AllWeaponsById(), 
            function(index_obj) {
              return index_obj.Name.split(' -', 1)[0];
            }
          );
      },
      'PointsByDamageType': function(value) {
        properties.PointsByDamageType = 
          normalize_by_index(value, metadata.get_AllWeaponsById(), 
            function(index_obj) {
              return index_obj.Name.split(' -', 1)[0];
            }
          );          
      },
      'MedalCountsByType': function(value) {
        properties.MedalCountsByType =
          normalize_by_index(value, metadata.get_AllMedalsById(),
            function(index_obj) {
              return index_obj.Name;
            }
          );
      },
      'DeathsByEnemyTypeClass': function(value) {
        properties.DeathsByEnemyTypeClass =
          normalize_by_index(value, metadata.get_AllEnemiesById(),
            function(index_obj) {
              return index_obj.Name;
            }
          );
      },
      'KillsByEnemyTypeClass': function(value) {
        properties.KillsByEnemyTypeClass =
          normalize_by_index(value, metadata.get_AllEnemiesById(),
            function(index_obj) {
              return index_obj.Name;
            }
          );
      },
      'PointsByEnemyTypeClass': function(value) {
        properties.PointsByEnemyTypeClass =
          normalize_by_index(value, metadata.get_AllEnemiesById(),
            function(index_obj) {
              return index_obj.Name;
            }
          );          
      }
      
      
      
      
      
      
      
      
      
    },
    instance = {};

  if (typeof gamertag !== 'string') {
    console.log("Non-string gamertag!");
    return false;
  }
  
  instance.gamertag = gamertag;
  
  if (typeof metadata === 'undefined') {
    console.log('Undefined metadata!')
    return false;
  }
  
//  console.log(typeof metadata.get_AllMapsById());

  instance.type = 'PlayerStats';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);

  return instance;
}

exports.PlayerStats = PlayerStats;
