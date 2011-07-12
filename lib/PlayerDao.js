
var
  Cache = require('../lib/Cache.js').Cache,
  ApiClient = require('../lib/ApiClient.js').ApiClient;


function PlayerDao() {
  var
    instance = {};
    
  function get(id) {
    
  }
  
  function exists(id) {
    
  }
  
  instance.get = get;
  instance.exists = exists;
    
  return instance;
}