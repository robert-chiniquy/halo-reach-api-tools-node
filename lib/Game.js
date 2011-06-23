
/**
 * http://www.haloreachapi.net/wiki/GetGameDetails
 * 
 */

var
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;


function Game(props, prop_map) {
  var
    properties = {
      'BaseMapName': undefined,
      'GameDuration': undefined,
      'GameId': undefined,
      'GameTimestamp': undefined,
      'GameVariantClass': undefined,
      'GameVariantHash': undefined,
      'GameVariantName': undefined,
      'HasDetails': undefined,
      'IsTeamGame': undefined,
      'MapName': undefined,
      'PlayerCount': undefined,
      'Players': undefined, // array
      'PlaylistName': undefined,
      'Teams': undefined
    },
    setters = {
      
    },
    instance;
    
  instance.type = 'Game';
  instance = CacheableEntity(instance, properties, setters, props, prop_map);
  return instance;
}

exports.Game = Game;