var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,
  Metadata = require('../lib/Metadata.js').Metadata;

/**
 * @todo check if jasmine-node really acts weird 
 *        with objects with properties named 'undefined' 
 *        whose values are undefined
 */

describe('Metadata', function() {

  beforeEach(function() {
    //Cache.prototype.select(TEST_REDIS_DB);
  });  
  
  it('should be constructable from mock', function() {
    var
      mac = MockApiClient();
    
    mac.get('game/metadata',
      mac.mock_args,
      function(err, data) {
        var
          meta = Metadata(data);
          
        expect(meta.id).toEqual(0);
        asyncSpecDone();
      }
    );
     
    asyncSpecWait();
  });
  
  
  it('should be constructable from cache', function() {
    
    var
      dfd = $.Deferred(),
      mac = MockApiClient(),
      meta = Metadata();
      
    mac.get('game/metadata',
      mac.mock_args,
      function(err, data) {
        meta = Metadata(data);  
        meta.store();
        
//        console.log(meta.getProperties());
        
        meta = undefined;
        dfd.resolve();
      }
    );
      
    $.when(dfd)
      .done(function() {
        meta = Metadata();
        $.when(meta.fetch())
          .done(function() {
            var
              variants = meta.get_GameVariantClassesKeysAndValues(),
              maps = meta.get_AllMapsById(),
              ranks = meta.get_GlobalRanks(),
              playlists = meta.get_AllReachPlaylists(),
              weapons = meta.get_AllWeaponsById();
              
            expect(typeof meta.get_CurrentArenaSeason()).toEqual('number');
            
            expect(typeof playlists).toNotEqual('undefined');
            expect(typeof playlists[101]).toNotEqual('undefined');
            expect(playlists[101].Id).toEqual('101');
            
            expect(typeof ranks).toEqual('object');
            expect(ranks[0].DisplayName).toEqual('Recruit');
            
            expect(typeof weapons).toEqual('object');            
            expect(typeof weapons[0]).toEqual('object');
            expect(weapons[0].Name).toEqual('Unknown Event');

            expect(typeof maps).toEqual('object');
            expect(typeof maps[1035]).toEqual('object');
            expect(typeof maps[1035].Name).toEqual('string');            
            expect(maps[1035].Name).toEqual('Boardwalk');            

            expect(typeof variants).toEqual('object');
            expect(typeof variants[3]).toEqual('string');
            expect(variants[3]).toEqual('Competitive');

            //console.log(variants);
            //console.log(meta.getProperties());

            asyncSpecDone();
          });
      });
     
    asyncSpecWait();
        
  });
  
 
});
  
