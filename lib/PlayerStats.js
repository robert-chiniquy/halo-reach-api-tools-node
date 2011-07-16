

var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;


function PlayerStats(gamertag, metadata, props, prop_map) {
  var
    properties = {
      'HopperId': undefined,
      'MapId': undefined,
      'DeathsByDamageType': undefined, // array
      'DeathsByEnemyTypeClass': undefined, // array
      'KillsByDamageType': undefined, // array
      'KillsByEnemyTypeClass': undefined, // array
      'PointsByDamageType': undefined,
      'PointsByEnemyTypeClass': undefined,
      'VariantClass': undefined,
      'biggest_kill_points': undefined,
      'biggest_kill_streak': undefined,
      'game_count': undefined,
      'highest_game_kills': undefined,
      'total_assists': undefined,
      'total_betrayals': undefined,
      'total_deaths': undefined,
      'total_enemy_players_killed': undefined,
      'total_first_place': undefined,
      'total_kills': undefined,
      'total_wins': undefined,
      
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
        instance.id = instance.gamertag + properties.HopperId; // tbd: fix gamertag?
      },
      'MapId': function(value) {
        properties.MapId = +value;
        instance.type = instance.type + ':byMap';
        instance.id = instance.gamertag + properties.MapId;     
      }
    },
    instance = {};

  instance.type = 'PlayerStats';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
/*
  instance.getKey = function() {
    
  };
*/

  instance.process_metadata = function(metadata) {
    
  };

  return instance;
}

exports.PlayerStats = PlayerStats;
