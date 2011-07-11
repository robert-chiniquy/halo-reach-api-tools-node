
var
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,
  Player = require('../lib/Player.js').Player;

describe('Player', function() {
  it('should be able to be instantiated', function() {
    var
      player_props = {'gamertag':'test'},
      p = Player(player_props);

    expect(p).toNotEqual(false);
    expect(p.get_gamertag()).toEqual('test');

  });
  
  it('should be constructable from player details nostats mock', function() {
    var
      mac = MockApiClient();
    
    mac.get('player/details/nostats',
      mac.mock_args,
      function(err, data) {
        var
          player = Player(data);
          
        expect(player.get_gamertag()).toEqual(mac.mock_args.gamertag);
          
        asyncSpecDone();
      }
    );
     
    asyncSpecWait();
  });
  
});