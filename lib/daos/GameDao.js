var
  $ = require('jquery/dist/node-jquery.js'),
  BASE_DIR = require('../../lib/config.js').BASE_DIR,  
  MetadataDao = require(BASE_DIR+'lib/daos/MetadataDao.js').MetadataDao,
  Game = require(BASE_DIR+'lib/models/Game.js').Game,  
  Cache = require(BASE_DIR+'lib/services/Cache.js').Cache;

/**
 * builds the Game entity from:
 * http://www.haloreachapi.net/wiki/GetGameDetails
 * 
 * 
 * 
 * http://www.haloreachapi.net/wiki/GetGameHistory
 *
 * @param {ApiClient|MockApiClient} ApiClient
 * 
 */
function GameDao(ApiClient) {
  var
    metadata,
    client = ApiClient(),
    instance = {};

  /**
   * @returns {Deferred} representing completion of load
   */
  function load_metadata() {
    var
      mdd = MetadataDao(ApiClient);

    if (typeof metadata !== 'undefined') {
      return true;
    }

    return mdd.get(
      function(err, obj) {
        metadata = obj;
      }
    );    
  }

  /**
   * Gets a Game by id from either cache or api (game details)
   * Stores Game in cache if from api
   * 
   * @param {String} id of game to get
   * @param {function(err, val)} assign_callback
   *
   * @returns {Deferred} representing completion of get
   */
  function get(id, assign_cb) {
    var
      err,
      game,
      dfd = $.Deferred(),
      // wrap cb to write to cache
      assign_callback = function(err, g) {
        if (typeof g !== 'undefined') {
          g.store();
        }
        assign_cb(err, g);
      };
    
    function get_api() {        
      getGameDetails(id, function(err, val) {
        //console.log('got api');
        game = Game(metadata, val);
        assign_callback(err, game); // tbd
        dfd.resolve();
      });      
    }
    
    function get_cache() {
      //console.log('get cache');     
      
      game = Game(metadata, {
        'gameId': id
      });
      
      $.when(game.fetch())
        .done(function() {
          assign_callback(err, game);
          dfd.resolve();
        });      
    }
    
    $.when(load_metadata())
      .done(function() {
        $.when(exists(id))
          .done(get_cache)
          .fail(get_api);
      }
    );
      
    return dfd;
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

  function getGameDetails(id, assign_callback) {
    return buildFromOneCall('game/details', {
      'gameId': id
    }, assign_callback);
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