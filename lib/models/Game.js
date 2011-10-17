/**
 * http://www.haloreachapi.net/wiki/GetGameDetails
 * 
 * 
 * 
 * http://www.haloreachapi.net/wiki/GetGameHistory
 */

var
  BASE_DIR = require('../../lib/config.js').BASE_DIR,
  CacheableEntity = require(BASE_DIR+'lib/types/CacheableEntity.js').CacheableEntity;


function Game(metadata, props, prop_map) {
  var
    properties = {
      'GameId': undefined, // id, history, details
      
      'Players': undefined, // array of Player, from details
      'Teams': undefined, // details
      
      'PlayerCount': undefined, // history, details
      'IsTeamGame': undefined, // history, details
      
      'PlaylistName': undefined, // history, details
      'MapName': undefined, // history, details
      'BaseMapName': undefined, // details
      'MapVariantHash': undefined, // history
      
      'GameVariantClass': undefined, // history, details
      'GameVariantHash': undefined, // history, details
      'GameVariantName': undefined, // history, details
      
      'GameDuration': undefined, // history, details
      'GameTimestamp': undefined, // history, details
      
      'HasDetails': undefined, // reflects if the data came from game/details

      'CampaignDifficulty': undefined, // history, details
      'CampaignGlobalScore': undefined, // history, details
      'CampaignMetagameEnabled': undefined, // history, details
      'GameVariantIconIndex': undefined // history, details
            
    },
    setters = {
      'GameId': function(value) {
        properties.GameId = value;
        instance.id = properties.GameId;
      },
      'Players': function(value) {
        
      }
      
    },
    instance = {};
    
  instance.type = 'Game';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
  return instance;
}

exports.Game = Game;