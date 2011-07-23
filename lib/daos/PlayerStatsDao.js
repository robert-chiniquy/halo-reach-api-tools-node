
var
  $ = require('jquery'),//dist/node-jquery.js'),
  BASE_DIR = require('../../lib/config.js').BASE_DIR,
  MetadataDao = require(BASE_DIR+'lib/daos/MetadataDao.js').MetadataDao,  
  PlayerStats = require(BASE_DIR+'lib/models/PlayerStats.js').PlayerStats,  
  Cache = require(BASE_DIR+'lib/services/Cache.js').Cache;
  

/**
 * @param {ApiClient|MockApiClient} ApiClient
 */
function PlayerStatsDao(ApiClient) {
  var
    client = ApiClient(),
    metadata,
    instance = {};

  /**
   * @returns {Deferred} representing completion of load
   */
  function load_metadata() {
    var
      mdd = MetadataDao(ApiClient);

    return mdd.get(
      function(err, obj) {
        metadata = obj;
      }
    );    
  }

  /**
   * @returns {Deferred} representing completion of get
   */
  function get(id, assign_callback) {
    var
      player_stats,
      dfd = $.Deferred(),
      results = {},
      add_results = function(err, p) {
        results = $.extend(results, p);
      };

    function get_api() {

      $.when(
      
        getDetailsByPlaylistOnly(id, add_results),
        getDetailsByMapOnly(id, add_results)
        
      ).done(function() {
                    
        assign_callback(results); // indexed by mapname and playlistname
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
      .done(get_cache)
      .fail(get_api);    
    
    // todo: when do I set cache for these results?
    
    return dfd;
  } 


  // this *should* return stats objs indexed by id/playlist
  function getDetailsByPlaylistOnly(id, assign_callback) {
    return buildFromOneCall('player/details/byplaylist', 
      {
        'gamertag': id
      }, 
      function(err, arr) {
        var
          ps, i, // for iteration          
          ret = {};
          
        for (i=0; i<arr.length; i++) {
          ps = PlayerStats(id, metadata, arr[i]);
          ret[ps.get_PlaylistName()] = ps;
        }
              
        assign_callback(err, ret);        
      }  
    );
  }
  
  
  // this *should* return stats objs indexed by id/mapname
  function getDetailsByMapOnly(id, assign_callback) {    
    return buildFromOneCall('player/details/bymap', 
      {
        'gamertag': id
      },       
      function(err, arr) {
        var
          ps, i, // for iteration          
          ret = {};
          
        for (i=0; i<arr.length; i++) {
          ps = PlayerStats(id, metadata, arr[i]);
          ret[ps.get_MapName()] = ps;
        }
              
        assign_callback(err, ret);        
      }  
    );        
  }  
  
  function buildFromOneCall(action, args, assign_callback) {
    var
      dfd = $.Deferred();
      
    $.when(load_metadata())
      .done(function() {
        client.get(action, args, function(err, obj) {
          assign_callback(err, obj);
          dfd.resolve();
        });      
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
  
  instance.prototype = PlayerStatsDao.prototype;
  
  return instance;
}

/**
 * alters its parameter as well as returning a value
 * @param {object} props the object to select and delete properties from
 * @returns {object} with only the selected properties
 */
PlayerStatsDao.prototype.selectPlayerSpecificProps = function(props) {
  var
    i, // for iteration
    ret = {}, // return object
    player_specific_props = {
      'RequestedPlayerAssists': undefined,
      'RequestedPlayerDeaths': undefined,
      'RequestedPlayerKills': undefined,
      'RequestedPlayerRating': undefined,
      'RequestedPlayerScore': undefined,
      'RequestedPlayerStanding': undefined
    };

  for (i in props) {
    if (({}).hasOwnProperty.call(props, i)) {
      if (({}).hasOwnProperty.call(player_specific_props, i)) {
        ret[i] = props[i];
        delete props[i];
      }
    }
  }
  
  if (typeof props.GameId !== 'undefined') {
    ret.GameId = props.GameId;
  }
  
  return ret;
}

exports.PlayerStatsDao = PlayerStatsDao;