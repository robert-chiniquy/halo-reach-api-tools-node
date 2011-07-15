var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Cache = require('../lib/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,  
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,  
  PlayerDao = require('../lib/PlayerDao.js').PlayerDao;


describe('PlayerDao', function() {
    
  beforeEach(function() {
    Cache.prototype.select(TEST_REDIS_DB);    
    Cache.prototype.flushdb();
  });

  it('should detect non-existence', function() {
    var
      existed,
      pd = PlayerDao(MockApiClient);
            
    $.when(pd.exists('cioj'))
      .fail(function(){
        existed = false;
        asyncSpecDone();
        expect(existed).toEqual(false); 
      })
      .done(function(){
        existed = true;
        asyncSpecDone();
        expect(existed).toEqual(false); 
      });
      
    asyncSpecWait();
  });
  
  /*
  it('should load with get', function() {
    var
      existed,
      pd = PlayerDao(MockApiClient),
      player;
      
    $.when(        
      pd.get('cioj', function(err, obj) {
        player = obj;
        

        $.when(pd.exists())
          .fail(function(){
            existed = false;
            asyncSpecDone();
            expect(existed).toEqual(true); 
          })
          .done(function(){
            existed = true;
            asyncSpecDone();
            expect(existed).toEqual(true); 
          });      
      })
    ).done(function() {
      expect(true).toEqual(true);         
      asyncSpecDone();
    })
    .fail(function() {
      expect(1).toEqual(2);
      asyncSpecDone();
    });
      
    asyncSpecWait();    
  });
  */

  it('should be able to load from getDetailsNoStatsOnly', function() {
    var
      pd = PlayerDao(MockApiClient),
      player;

    $.when(
      pd.getDetailsNoStatsOnly(
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

  it('should be able to load from getDetailsByPlaylistOnly', function() {
    var
      pd = PlayerDao(MockApiClient),
      player;

    $.when(
      pd.getDetailsByPlaylistOnly(
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


});