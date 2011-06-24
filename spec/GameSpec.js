
var
  Game = require('../lib/Game.js').Game;
  
describe('Game', function() {
  it('should be able to be instantiated', function() {
    var
      game_props = {'GameId':'test'},
      g = Game(game_props);

    expect(g).toNotEqual(false);
    expect(typeof g.get_Teams()).toEqual('undefined');
    
  });
});