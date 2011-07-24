

var
  $ = require('jquery/dist/node-jquery.js'),
  Cache = require('../lib/services/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,  
  MetadataDao = require('../lib/daos/MetadataDao.js').MetadataDao,  
  GameDao = require('../lib/daos/GameDao.js').GameDao,
  Game = require('../lib/models/Game.js').Game;

describe('GameDao', function() {
  var
    test_game_id = 689591721,
    meta_dfd, // deferred resolved when metadata is ready
    metadata; // metadata

  beforeEach(function() {   
    var
      mdd = MetadataDao(MockApiClient);

    meta_dfd = mdd.get(
        function(err, obj) {
          metadata = obj;
        }
      );

    Cache.prototype.select(TEST_REDIS_DB);    
    Cache.prototype.flushdb();    
  });

  it('should detect non-existence', function() {
    var
      existed,
      gd = GameDao(MockApiClient);
            
    $.when(gd.exists(test_game_id))
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










});