var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Cache = require('../lib/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,  
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,    
  PlayerDao = require('../lib/PlayerDao.js').PlayerDao,
  Player = require('../lib/Player.js').Player;

describe('PlayerDao', function() {
  var
    test_user = 'cioj';


  beforeEach(function() {   
    Cache.prototype.select(TEST_REDIS_DB);    
    Cache.prototype.flushdb();
  });

  it('should detect non-existence', function() {
    var
      existed,
      pd = PlayerDao(MockApiClient);
            
    $.when(pd.exists(test_user))
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

  it('get should write to cache after getting from api', function() {
    var
      existed,
      pd = PlayerDao(MockApiClient);
      
    // cache starts empty, test user is gotten, then it should exist  
    pd.get(test_user, function(err, obj) {

      $.when(pd.exists(test_user))
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
    });
      
    asyncSpecWait();    
  });
  
  it('should get a player from api when cache is empy', function() {
    var
      existed,
      player,
      pd = PlayerDao(MockApiClient);
      
    $.when(        
      pd.get(test_user, function(err, obj) {        
        player = obj;        
        expect(player.get_service_tag()).toEqual('BAIT');                
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

  it('should get a player from cache when it can', function() {
    var
      existed,
      pd = PlayerDao(MockApiClient),      
      mac = MockApiClient();
    
    // write to cache
    mac.get('player/details/nostats',
      {
        'gamertag': test_user
      },
      function(err, data) {
        var
          player = Player(data);
        player.store();
      });
      
    // grab from cache
    $.when(        
      pd.get(test_user, function(err, obj) {
        $.when(pd.exists(test_user))
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

  it('should be able to load from getDetailsNoStatsOnly', function() {
    var
      pd = PlayerDao(MockApiClient),
      player;

    pd.getDetailsNoStats(
      'cioj', 
      function(err, obj) {
        player = obj
        expect(player.service_tag).toEqual('BAIT');
        asyncSpecDone();        
      }      
    );

    asyncSpecWait();        
  });

  /*
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
  */
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