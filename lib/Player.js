

/**
 * http://www.haloreachapi.net/wiki/GetPlayerDetailsWithNoStats
 * http://www.haloreachapi.net/wiki/GetPlayerDetailsWithStatsByPlaylist
 * http://www.haloreachapi.net/wiki/Metadata#GameVariantClassesKeysAndValues
 * http://www.haloreachapi.net/wiki/GetGameDetails#Players
 * 
 */

var
  Entity = require('Entity.js').Entity,
  Cacheable = require('Cacheable.js').Cacheable;
  
  
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
        this.id = properties.gamertag;
      },
      'AIStatistics': function(value) {
        // tbd array of http://www.haloreachapi.net/wiki/GetPlayerDetailsWithStatsByPlaylist#AiStatistics
      },
      'StatisticsByPlaylist': function(value) {
        // tbd ^^ 
      }
    },
    instance = Entity(properties, setters, props, prop_map);
    
  instance.type = 'Player';
  instance = Cacheable(instance);
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
        properties.HopperId = value;
        if (typeof properties.MapId !== 'undefined') {
          this.id = properties.HopperId + ':' + properties.MapId;
        }
      },
      'MapId': function(value) {
        properties.MapId = value;
        if (typeof properties.HopperId !== 'undefined') {
          this.id = properties.HopperId + ':' + properties.MapId;
        }
      }
    },
    instance = Entity(properties, setters, props, prop_map);
    
  instance.type = 'PlayerStatistics';
  instance = Cacheable(instance);
  return instance;
}