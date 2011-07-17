
var
  $ = require('jquery/dist/node-jquery.js'),
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,
  MetadataDao = require('../lib/daos/MetadataDao.js').MetadataDao,  
  PlayerStats = require('../lib/models/PlayerStats.js').PlayerStats;


describe('PlayerStats', function() {
  var
    meta_dfd, // deferred resolved when metadata is ready
    meta; // metadata

  beforeEach(function() {
    var
      mdd = MetadataDao(MockApiClient);

    meta_dfd = 
      mdd.get(
        function(err, obj) {
          meta = obj;
        }
      );
  });
  
  it('should be able to be instantiated', function() {
    var
      player_stats_props = {
        'MapId':'1000'
      },
      ps;

    $.when(meta_dfd)
      .done(function() {
  //      console.log(meta.getProperties());
        ps = PlayerStats('cioj', meta, player_stats_props);
        expect(ps).toNotEqual(false);
        expect(ps.gamertag).toEqual('cioj');
    });

  });
 
  it('should be constructable from the map stats mock', function() {
    var
      mac = MockApiClient();
     
    // have to get metadata before you can instantiate stats
    $.when(meta_dfd).done(function() {
      mac.get('player/details/bymap',
        mac.mock_args,
        function(err, data) { // data is an array of playerstats objects
          var
            i, // for iteration
            player_stats_arr = [];

          for (i=0; i<data.length; i++) {
            player_stats_arr[i] = PlayerStats(mac.mock_args.gamertag, meta, data[i]);

            expect(player_stats_arr[i].gamertag).toEqual(mac.mock_args.gamertag);
            expect(typeof player_stats_arr[i].get_MapId()).toEqual('number');
            //expect(typeof player_stats_arr[i].get_MapName()).toEqual('string');            
            
          }          

          asyncSpecDone();
        }
      );
    });
    
    asyncSpecWait();
  });

  it('should be constructable from the playlist stats mock', function() {
    var
      mac = MockApiClient();
     
    // have to get metadata before you can instantiate stats
    $.when(meta_dfd)
      .done(function() {
        mac.get('player/details/byplaylist',
          mac.mock_args,
          function(err, data) { // data is an array of playerstats objects
            var
              i, // for iteration
              player_stats_arr = [];

            for (i=0; i<data.length; i++) {
              
              player_stats_arr[i] = PlayerStats(mac.mock_args.gamertag, meta, data[i]);

              expect(player_stats_arr[i].gamertag).toEqual(mac.mock_args.gamertag);

              expect(typeof player_stats_arr[i].get_HopperId()).toEqual('number');
              expect(typeof player_stats_arr[i].get_PlaylistName()).toEqual('string');            
            }          

            asyncSpecDone();
          }
        );
    });
    
    asyncSpecWait();
  });




});