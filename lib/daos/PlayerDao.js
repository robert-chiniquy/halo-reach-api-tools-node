
var
  $ = require('jquery/dist/node-jquery.js'),
  BASE_DIR = require('../../lib/config.js').BASE_DIR,  
  MetadataDao = require(BASE_DIR+'lib/daos/MetadataDao.js').MetadataDao,
  Player = require(BASE_DIR+'lib/models/Player.js').Player,  
  Cache = require(BASE_DIR+'lib/services/Cache.js').Cache;

/**
 * @param {ApiClient|MockApiClient} ApiClient
 */
function PlayerDao(ApiClient) {
  var
    metadata,
    client = ApiClient(),
    instance = {};

  /**
   * @returns {Deferred} representing completion of get
   */
  function get(id, assign_callback) {
    var
      player,
      mdd = MetadataDao(ApiClient),
      dfd = $.Deferred(),
      props = {

      },
      extend_props = function(err, p) {
        if (typeof err !== 'undefined' && err !== null) {        
          console.log(err);
        }
        props = $.extend(props, p);
      };

    function get_api() {
      //console.log('getting api for '+ id);

      $.when(
        getDetailsNoStats(id, extend_props)
      ).done(function() {
        var
          err;
        
        if (typeof props.gamertag === 'undefined') {
          err = 'Retrived properties have no gamertag!!';
          console.log(err);
          dfd.fail();
          return;
        }
        else {
          player = Player(metadata, props);
          player.store();
          assign_callback(err, player);
          dfd.resolve();
        }
      });        
    }

    function get_cache() {
      //console.log('getting cache for '+ id);

      player = Player(metadata, {'gamertag': id});

      $.when(player.fetch())
        .done(function() {
          assign_callback({}, player);
          dfd.resolve();
        });      
    }
    
    $.when(      
      mdd.get(
        function(err, obj) {
          metadata = obj;
        }
      ))
      .done(function() {
        $.when(exists(id))
          .done(get_cache)
          .fail(get_api);    
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
  
  function getDetailsNoStats(id, assign_callback) {
    return buildFromOneCall('player/details/nostats', 
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
  
  /**
   * @param {string} id the gamertag of the user to check existence for
   */
  function exists(id) {
    var
      player = Player(metadata, {'gamertag': id}),
      dfd = $.Deferred();
      
    if (typeof id === 'undefined') {
      console.log('id is undefined!');
      dfd.reject();
    }
    
    Cache.prototype.exists(player.getKey(), function(err, obj) {
      if (typeof obj !== 'undefined') {
        if (obj === 0) {
          //console.log("  cache doesn't exist for " + player.getKey());
          if (typeof err !== 'undefined' && err !== null) {
            console.log(err);
          }
          dfd.reject();
        }
        else { // obj === 1
          //console.log("  cache exists for " + player.getKey());
          dfd.resolve();
        }
      }
    });
    return dfd;
  }
  
  instance.get = get;
  instance.exists = exists;
  
  instance.getGameHistory = getGameHistory;
  instance.getDetailsNoStats = getDetailsNoStats;
  
  return instance;
}

exports.PlayerDao = PlayerDao;