
var
  $ = require('jquery/dist/node-jquery.js'),
  Cache = require('../lib/services/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,      
  PlayerStatsDao = require('../lib/daos/PlayerStatsDao.js').PlayerStatsDao;


describe('PlayerStatsDao', function() {
  
  
  it('should be able to load from getDetailsByPlaylistOnly', function() {
    var
      psd = PlayerStatsDao(MockApiClient),
      player_stats;

    psd.getDetailsByPlaylistOnly(
      'cioj', 
      function(err, obj) {
        player_stats = obj;
        
        expect(typeof player_stats).toNotEqual('undefined');
        expect(player_stats).toNotEqual(null);
        
        asyncSpecDone();        
      }      
    );

    asyncSpecWait();        
  });
  
  it('should be able to load from getDetailsByMapOnly', function() {
    var
      psd = PlayerStatsDao(MockApiClient),
      player_stats;

    psd.getDetailsByMapOnly(
      'cioj', 
      function(err, obj) {
        player_stats = obj;

        expect(typeof player_stats).toNotEqual('undefined');
        expect(player_stats).toNotEqual(null);

        asyncSpecDone();        
      }      
    );

    asyncSpecWait();        
  });
  
  it('should select out player-specific props from gamehistory', function() {
    var
      out,
      test = 
        { 
          CampaignDifficulty: 'Easy',
          CampaignGlobalScore: 0,
          CampaignMetagameEnabled: false,
          GameDuration: 587,
          GameId: 684192583,
          GameTimestamp: '/Date(1309796572000-0700)/',
          GameVariantClass: 3,
          GameVariantHash: 1813064232214005500,
          GameVariantIconIndex: 1,
          GameVariantName: 'Slayer DMRs',
          HasDetails: false,
          IsTeamGame: true,
          MapName: 'Forge World',
          MapVariantHash: -6604488719888003000,
          PlayerCount: 8,
          PlaylistName: 'Team Slayer',
          RequestedPlayerAssists: 2,
          RequestedPlayerDeaths: 16,
          RequestedPlayerKills: 20,
          RequestedPlayerRating: 0,
          RequestedPlayerScore: 50,
          RequestedPlayerStanding: 0 
        };
        
      out = PlayerStatsDao.prototype.selectPlayerSpecificProps(test);
      
      expect(typeof out).toEqual('object');
      expect(typeof out.RequestedPlayerAssists).toNotEqual('undefined');
    
  });
  
});
