
var
  BASE_DIR = require('../lib/config.js').BASE_DIR,
  $ = require('jquery/dist/node-jquery.js'),
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,
  MetadataDao = require('../lib/daos/MetadataDao.js').MetadataDao, 
  Player = require('../lib/models/Player.js').Player;

describe('Player', function() {
  
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
  });
  
  it('should be able to be instantiated', function() {
    var
      completed = false;

    $.when(meta_dfd)
      .done(function() {
        
        var
          player_props = {'gamertag':'test'},
          p = Player(metadata, player_props);

        expect(p).toNotEqual(false);
        expect(p.get_gamertag()).toEqual('test');
        
        asyncSpecDone();
        completed = true;
        
      });

    if (!completed) { // asyncSpecDone() might already have been called
      asyncSpecWait();
    }
  });
  
  
  it('should be constructable from player details nostats mock', function() {
    var
      mac = MockApiClient();
    
    $.when(meta_dfd)
      .done(function() {
        mac.get('player/details/nostats',
          mac.mock_args,
          function(err, data) {
            var
              player = Player(metadata, data);

            expect(player.get_gamertag()).toEqual(mac.mock_args.gamertag);

            asyncSpecDone();
          }
        )
      });
    
    asyncSpecWait();
  });
  
});