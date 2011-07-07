

/**
 * http://www.haloreachapi.net/wiki/GetPlayerDetailsWithNoStats
 * http://www.haloreachapi.net/wiki/GetPlayerDetailsWithStatsByPlaylist
 * http://www.haloreachapi.net/wiki/Metadata#GameVariantClassesKeysAndValues
 * http://www.haloreachapi.net/wiki/GetGameDetails#Players
 * 
 * tbd:
 * http://www.haloreachapi.net/wiki/GetGameHistory
 */

var
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;
  
  
function Player(props, prop_map) {
  var
    properties = {
      'gamertag': undefined,
      'service_tag': undefined,
      'first_active': undefined,
      'games_total': undefined,
      'last_active': undefined,
      'AiStatistics': undefined, // array of AggregatePlayerStatistics
      'StatisticsByPlaylist': undefined // array of AggregatePlayerStatistics
            
    },
    setters = {
      'gamertag': function(value) {
        properties.gamertag = value;
        instance.id = properties.gamertag;
      }/*,
      'AIStatistics': function(value) {
        // tbd array of http://www.haloreachapi.net/wiki/GetPlayerDetailsWithStatsByPlaylist#AiStatistics
      },
      'StatisticsByPlaylist': function(value) {
        // tbd ^^ 
      }*/
    },
    instance = {};

  instance.type = 'Player';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
  return instance;
}




function AggregatePlayerStatistics(props, prop_map) {
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
      'total_wins': undefined
    },
    setters = {
      'HopperId': function(value) {
        properties.HopperId = +value;
        $.when(instance.MapId_is_set)
          .done(function() {
            instance.id = properties.HopperId + ':' + properties.MapId;            
          });
      },
      'MapId': function(value) {
        properties.MapId = +value;
      }
    },
    instance = {};
    
  instance.type = 'AggregatePlayerStatistics';
  instance = CacheableEntity(properties, setters, props, prop_map);
  return instance;
}

exports.Player = Player;
exports.AggregatePlayerStatistics = AggregatePlayerStatistics;