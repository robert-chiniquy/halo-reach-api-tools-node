
var
  $ = require('jquery/dist/node-jquery.js'),
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,
  Cache = require('../lib/services/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,    
  MetadataDao = require('../lib/daos/MetadataDao.js').MetadataDao,   
  Game = require('../lib/models/Game.js').Game;
  
  
describe('Game', function() {
  var
    meta_dfd, // deferred resolved when metadata is ready
    metadata; // metadata

  beforeEach(function() {
    
    var
      mdd = MetadataDao(MockApiClient);

    meta_dfd = 
      mdd.get(
        function(err, obj) {
          metadata = obj;
        }
      );
      
    Cache.prototype.select(TEST_REDIS_DB);    
    Cache.prototype.flushdb();
  });  
  
  
  it('should be able to be instantiated', function() {
    
    $.when(meta_dfd)
      .done(function() {

        var
          game_props = {'GameId':'test'},
          g = Game(metadata, game_props);

        expect(g).toNotEqual(false);
        expect(typeof g.get_Teams()).toEqual('undefined');

      }    
    );
  });
  
  
  it('should be constructable from game details mock', function() {
    var
      mac = MockApiClient();
    
    mac.get('game/details',
      mac.mock_args,
      function(err, data) {
        var
          game = Game(metadata, data);
          
        expect(game.get_GameId()).toEqual(mac.mock_args.gameId);
          
        asyncSpecDone();
      }
    );
     
    asyncSpecWait();
  });
  
  it('should load from game history mock', function() {
    var
      mac = MockApiClient();
    
    $.when(meta_dfd)
      .done(function() {
        mac.get('player/gamehistory',
          mac.mock_args,
          function(err, data) {
//            
//            
//            
//            var
//              game = Game(metadata, data);

//            expect(player.get_gamertag()).toEqual(mac.mock_args.gamertag);

            asyncSpecDone();
          }
        )
      });
    
    asyncSpecWait();
  });
  
  
});