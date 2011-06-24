
var
  Player = require('../lib/Player.js').Player;

describe('Player', function() {
  it('should be able to be instantiated', function() {
    var
      player_props = {'gamertag':'test'},
      p = Player(player_props);

    expect(p).toNotEqual(false);
    expect(p.get_gamertag()).toEqual('test');

  });
});