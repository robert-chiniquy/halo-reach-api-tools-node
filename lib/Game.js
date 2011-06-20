
/**
 * http://www.haloreachapi.net/wiki/GetGameDetails
 * 
 */

var
  Entity = require('Entity.js').Entity,
  Cacheable = require('Cacheable.js').Cacheable;


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
    instance = Entity(properties, setters, props, prop_map);
    
  instance.type = 'Game';
  instance = Cacheable(instance);
  return instance;
}