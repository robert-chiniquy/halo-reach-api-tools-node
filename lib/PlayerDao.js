
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Player = require('../lib/Player.js').Player,  
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
    var
      player,
      dfd = $.Deferred(),
      props = {},
      extend_props = function(err, p) {
        props = $.extend(props, p);
      };
          
    $.when(exists(id))
      .done(function() {
        player = Player({'gamertag': id});
        
        $.when(player.fetch())
          .done(function() {
            assign_callback({}, player);
            dfd.resolve();
          });
      })
      .fail(function() {
        $.when(
          getDetailsByPlaylistOnly(id, extend_props),
          getDetailsByMapOnly(id, extend_props)
        ).done(function() {
          console.log(props);
          player = Player(props);
          player.store();
          assign_callback(player);
          dfd.resolve();
        });        
      });    
    
    return dfd;
  }
  
  function getGameHistory(id, assign_callback, page, gametype) {
    var
      args = {
        'gamertag': id        
      };
    
    if (typeof page !== 'undefined') {
      args.iPage = page;
    }
    
    if (typeof gametype !== 'undefined') {
      args.variant_class = gametype;
    }
      
    return buildFromOneCall('player/gamehistory', args, assign_callback);    
  }
  
  function getDetailsByPlaylistOnly(id, assign_callback) {
    return 
      buildFromOneCall('player/details/byplaylist', 
        {
          'gamertag': id
        }, 
        assign_callback);
  }
  
  function getDetailsByMapOnly(id, assign_callback) {
    return 
      buildFromOneCall('player/details/bymap', 
        {
          'gamertag': id
        }, 
        assign_callback);        
  }
  
  function getDetailsNoStatsOnly(id, assign_callback) {
    return 
      buildFromOneCall('player/details/nostats', 
      {
        'gamertag': id
      }, 
      assign_callback);
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
  
  function exists(id) {
    var
      player = Player({'gamertag': id}),
      dfd = $.Deferred();
      
    if (typeof id === 'undefined') {
      console.log('id is undefined!');
      return false;
    }
      
    Cache.prototype.exists(player.getKey(), function(err, obj) {
      if (typeof obj !== 'undefined') {
        if (obj === 0) {
          if (typeof err !== 'unefined' && err !== null) {
            console.log(err);
          }
          dfd.reject();
        }
        else {
          dfd.resolve();
        }
      }
    });
    
    return dfd;
  }
  
  instance.get = get;
  instance.exists = exists;
  
  instance.getGameHistory = getGameHistory;
  instance.getDetailsByPlaylistOnly = getDetailsByPlaylistOnly;
  instance.getDetailsByMapOnly = getDetailsByMapOnly;
  instance.getDetailsNoStatsOnly = getDetailsNoStatsOnly;
  
  return instance;
}

exports.PlayerDao = PlayerDao;