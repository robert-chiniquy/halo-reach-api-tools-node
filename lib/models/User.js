
var
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;

function User(props, prop_map) {
  var
    properties = {
      'gamertag': undefined
    },
    setters = {
      'gamertag': function(value) {
        properties.gamertag = value;
        this.id = properties.gamertag;
      }
    },
    instance = {};

    instance.type = 'User';
    instance = CacheableEntity(properties, setters, props, prop_map);
}