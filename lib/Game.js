
/**
 * http://www.haloreachapi.net/wiki/GetGameDetails
 * 
 */

var
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;


function Game(props, prop_map) {
  var
    properties = {
      'GameId': undefined,
      'PlaylistName': undefined,
      'MapName': undefined,
      'BaseMapName': undefined,
      'MapVariantHash': undefined,
      'GameVariantClass': undefined,
      'GameVariantHash': undefined,
      'GameVariantName': undefined,
      'GameDuration': undefined,
      'GameTimestamp': undefined,
      'HasDetails': undefined,
      'PlayerCount': undefined,
      'Players': undefined, // array of Player
      'IsTeamGame': undefined,
      'Teams': undefined,

      'CampaignDifficulty': undefined,
      'CampaignGlobalScore': undefined,
      'CampaignMetagameEnabled': undefined,
      'GameVariantIconIndex': undefined
    },
    setters = {
      'GameId': function(value) {
        properties.GameId = value;
        instance.id = properties.GameId;
      }
    },
    instance = {};
    
  instance.type = 'Game';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
  return instance;
}

exports.Game = Game;