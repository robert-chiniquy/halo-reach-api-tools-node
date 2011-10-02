var
  $ = require('jquery/dist/node-jquery.js'),
  BASE_DIR = require('../../lib/config.js').BASE_DIR,  
  MetadataDao = require(BASE_DIR+'lib/daos/MetadataDao.js').MetadataDao,
  Game = require(BASE_DIR+'lib/models/Game.js').Game,  
  Cache = require(BASE_DIR+'lib/services/Cache.js').Cache;

/**
 * builds the Game entity from:
 * http://www.haloreachapi.net/wiki/GetGameDetails
 * http://www.haloreachapi.net/wiki/GetGameHistory
 *
 * @param {ApiClient|MockApiClient} ApiClient
 */
function GameDao(ApiClient) {
  var
    metadata,
    client = ApiClient(),
    instance = {};


  /**
   * @returns {Deferred} representing completion of get
   */
  function get(id, assign_callback) {
    
    
    
  }

  /**
   * @param {string} id the GameId to look for in cache
   * @return {$.Deferred} 
   */
  function exists(id) {
    var
      game = Game(metadata, {'GameId': id}),
      dfd = $.Deferred();
      
    if (typeof id === 'undefined') {
      console.log('id is undefined!');
      dfd.reject();
    }
    Cache.exists(game.getKey(), function(err, obj) {
      if (typeof obj !== 'undefined') {
        if (obj === 0) {
          if (typeof err !== 'undefined' && err !== null) {
            console.log(err);
          }
          dfd.reject();
        }
        else { // obj === 1
          dfd.resolve();
        }
      }
    });
        
    return dfd;
  }

  function getGameHistory(gamertag, assign_callback, page, gametype) {
    var
      args = {
        'gamertag': gamertag
      };
    
    if (typeof page !== 'undefined') {
      args.iPage = page;
    }
    
    if (typeof gametype !== 'undefined') {
      args.variant_class = gametype;
    }
      
    return buildFromOneCall('player/gamehistory', args, assign_callback);    
  }  

  function buildFromOneCall(action, args, assign_callback) {
    var
      dfd = $.Deferred();
      
    client.get(action, args, function(err, obj) {
      assign_callback(err, obj);
      dfd.resolve();
    });      
      
    return dfd;
  }

  instance.get = get;
  instance.exists = exists;

  instance.getGameHistory = getGameHistory;

  return instance;
}

exports.GameDao = GameDao;