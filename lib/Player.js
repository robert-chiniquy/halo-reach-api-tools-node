
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
      'credits_lifetime': undefined,

      'LastGameVariantClassPlayed': undefined,
      'CampaignProgressCoop': undefined,
      'CampaignProgressSp': undefined,      
      'CommendationState': undefined,
      'Initialized': undefined,
      'IsGuest': false,
      'daily_challenges_completed': undefined,
      'weekly_challenges_completed': undefined,
      'commendation_completion_percentage': undefined,
      'armor_completion_percentage': undefined,
      
      'appearance_primary_color': undefined,
      'appearance_secondary_color': undefined,
      'ReachEmblem': undefined           
    },
    setters = {
      'gamertag': function(value) {
        properties.gamertag = value;
        instance.id = properties.gamertag;
      },
      'CommendationState': function(value) {
        
      }
    },
    instance = {};

  instance.type = 'Player';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
  
  return instance;
}

exports.Player = Player;

