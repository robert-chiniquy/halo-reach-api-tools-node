
var
  Cache = require('../lib/Cache.js').Cache;

/**
 * @param {ApiClient|MockApiClient} ApiClient
 */
function PlayerDao(ApiClient) {
  var
    client = ApiClient(),
    instance = {};

  /**
   * @returns {Deferred} representing completion of get
   */
  function get(id, assign_callback) {
    
  }
  
  function exists(id) {
    
  }
  
  instance.get = get;
  instance.exists = exists;
    
  return instance;
}

exports.PlayerDao = PlayerDao;