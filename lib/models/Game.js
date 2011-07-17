
/**
 * http://www.haloreachapi.net/wiki/GetGameDetails
 * http://www.haloreachapi.net/wiki/GetGameHistory
 */

var
  BASE_DIR = require('../../lib/config.js').BASE_DIR,
  CacheableEntity = require(BASE_DIR+'lib/types/CacheableEntity.js').CacheableEntity;


function Game(metadata, props, prop_map) {
  var
    properties = {
      'GameId': undefined,
      'Players': undefined, // array of Player
      'PlayerCount': undefined,
      'IsTeamGame': undefined,
      'Teams': undefined,
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