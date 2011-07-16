
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  PlayerStats = require('../lib/Player.js').Player,  
  Cache = require('../lib/Cache.js').Cache;

/**
 * @param {ApiClient|MockApiClient} ApiClient
 */
function PlayerStatsDao(ApiClient) {
  var
    client = ApiClient(),
    instance = {};

  /**
   * @returns {Deferred} representing completion of get
   */
  function get(id, assign_callback) {
    var
      player_stats,
      dfd = $.Deferred(),
      props = {},
      extend_props = function(err, p) {
        props = $.extend(props, p);
      };

    function get_api() {

      $.when(
        getDetailsByPlaylistOnly(id, extend_props),
        getDetailsByMapOnly(id, extend_props)
      ).done(function() {
        player_stats = PlayerStats(props);
        player_stats.store();
        assign_callback(player_stats);
        dfd.resolve();
      });        
    }

    function get_cache() {
      player_stats = PlayerStats(
        {
          'gamertag': id
        }
      );

      $.when(player_stats.fetch())
        .done(function() {
          assign_callback({}, player_stats);
          dfd.resolve();
        });      
    }

    $.when(exists(id))
      .done(get_cache())
      .fail(get_api());    
    
    return dfd;
  } 
    
  function getDetailsByPlaylistOnly(id, assign_callback) {
    return buildFromOneCall('player/details/byplaylist', 
      {
        'gamertag': id
      }, 
      assign_callback);
  }
  
  function getDetailsByMapOnly(id, assign_callback) {
    return buildFromOneCall('player/details/bymap', 
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
      player_stats = PlayerStats(),
      dfd = $.Deferred();
      
    if (typeof id === 'undefined') {
      console.log('id is undefined!');
      return false;
    }
      
    Cache.prototype.exists(player_stats.getKey(), function(err, obj) {
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
  
  instance.getDetailsByPlaylistOnly = getDetailsByPlaylistOnly;
  instance.getDetailsByMapOnly = getDetailsByMapOnly;
  
  return instance;
}

exports.PlayerStatsDao = PlayerStatsDao;