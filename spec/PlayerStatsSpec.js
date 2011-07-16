
var
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,
  PlayerStats = require('../lib/PlayerStats.js').PlayerStats;

describe('PlayerStats', function() {
/*  
  it('should be able to be instantiated', function() {
    var
      player_stats_props = {
        'gamertag':'test'
      },
      ps = PlayerStats(player_stats_props);

    expect(ps).toNotEqual(false);
    expect(ps.get_gamertag()).toEqual('test');

  });
  */
 
  it('should be constructable from the map stats mock', function() {
    var
      mac = MockApiClient();
    
    mac.get('player/details/bymap',
      mac.mock_args,
      function(err, data) { // data is an array of playerstats objects
        var
          i, // for iteration
          player_stats_arr = [];
          
        for (i=0; i<data.length; i++) {
          player_stats_arr[i] = PlayerStats(mac.mock_args.gamertag, {}, data[i]);
          
          
          //expect(player_stats_arr[i].gamertag).toEqual(mac.mock_args.gamertag);
        }          
          
        asyncSpecDone();
      }
    );
    
    asyncSpecWait();
  });
  
});