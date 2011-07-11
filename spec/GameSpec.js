
var
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,
  Game = require('../lib/Game.js').Game;
  
describe('Game', function() {
  it('should be able to be instantiated', function() {
    var
      game_props = {'GameId':'test'},
      g = Game(game_props);

    expect(g).toNotEqual(false);
    expect(typeof g.get_Teams()).toEqual('undefined');
  });
  
  it('should be constructable from game details mock', function() {
    var
      mac = MockApiClient();
    
    mac.get('game/details',
      mac.mock_args,
      function(err, data) {
        var
          game = Game(data);
          
        expect(game.get_GameId()).toEqual(mac.mock_args.gameId);
          
        asyncSpecDone();
      }
    );
     
    asyncSpecWait();
  });
});