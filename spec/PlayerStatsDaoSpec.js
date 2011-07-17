
var
  $ = require('jquery/dist/node-jquery.js'),
  Cache = require('../lib/services/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,      
  PlayerStatsDao = require('../lib/daos/PlayerStatsDao.js').PlayerStatsDao;


describe('PlayerStatsDao', function() {
  
  
  it('should be able to load from getDetailsByPlaylistOnly', function() {
    var
      psd = PlayerStatsDao(MockApiClient),
      player_stats;

    psd.getDetailsByPlaylistOnly(
      'cioj', 
      function(err, obj) {
        player_stats = obj;
        
        expect(typeof player_stats).toNotEqual('undefined');
        expect(player_stats).toNotEqual(null);
        
        asyncSpecDone();        
      }      
    );

    asyncSpecWait();        
  });
  
  
  
});

/*
  it('should be able to load from getDetailsByMapOnly', function() {
    var
      pd = PlayerDao(MockApiClient),
      player;

    $.when(
      pd.getDetailsByMapOnly(
        'cioj', 
        function(err, obj) {
          player = obj
        }      
      )
    ).done(function() {
      expect(player.service_tag).toEqual('BAIT');
      asyncSpecDone();        
    });

    asyncSpecWait();        
  });
*/
