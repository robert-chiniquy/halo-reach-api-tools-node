

var
  $ = require('jquery/dist/node-jquery.js'),
  BASE_DIR = require('../../lib/config.js').BASE_DIR,  
  normalize_by_index = require(BASE_DIR+'lib/util.js').normalize_by_index,
  CacheableEntity = require(BASE_DIR+'lib/types/CacheableEntity.js').CacheableEntity;


/**
 * Generic data container for api data from player stats by map/playlist
 * as well as from player/game/details->Players etc
 * 
 *
 * @todo the way gamertag works is weird, fix it
 */
function PlayerStats(gamertag, metadata, props, prop_map) {
  var
    properties = {
      'HopperId': undefined,
      'MapId': undefined,
      'GameId': undefined,
      
/****************** These properties come from game/details *******************/      
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
      'total_waves_completed': undefined,
/***************** end game/details properties ********************************/

/***************** These properties come from player/gamehistory **************/
      'RequestedPlayerAssists': undefined,
      'RequestedPlayerDeaths': undefined,
      'RequestedPlayerKills': undefined,
      'RequestedPlayerRating': undefined,
      'RequestedPlayerScore': undefined,
      'RequestedPlayerStanding': undefined
/***************** end gamehistory props **************************************/
      
      
      
    },
    setters = {
      'GameId': function(value) { // not a gamedetails prop
        if (typeof value === 'undefined' || value === null) {
          return;
        }          
        properties.GameId = +value;
        instance.id = instance.gamertag +':byGame:'+ properties.GameId;
      },
      'HopperId': function(value) {
        if (typeof value === 'undefined' || value === null) {
          return;
        }          
        properties.HopperId = +value;


        properties.PlaylistName = 
          metadata.get_AllReachPlaylists()[properties.HopperId].Name;
        
        instance.add_getter('PlaylistName');
        
        instance.id = instance.gamertag +':'+ properties.PlaylistName;        
      },
      'MapId': function(value) {
        if (typeof value === 'undefined' || value === null) {
          return;
        }
        properties.MapId = +value;
        
        properties.MapName = 
          (properties.MapId === -1 // ?
            ? properties.MapId
            : metadata.get_AllMapsById()[value].Name);
            
        instance.add_getter('MapName');

        instance.id = instance.gamertag +':'+ properties.MapName;        
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
    console.log("Undefined metadata! PlayerStats won't build!")
    return false;
  }

  instance.type = 'PlayerStats';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);

  /*
  instance.getKey = function() {
    return instance.type +':'+ instance.gamertag +':'+
      (typeof properties.MapName === 'undefined'
        ? properties.PlaylistName
        : properties.MapName);        
  }
  */

  return instance;
}

exports.PlayerStats = PlayerStats;
