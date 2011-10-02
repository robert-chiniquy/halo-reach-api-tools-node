
var
  $ = require('jquery/dist/node-jquery.js'),
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,
  Metadata = require('../lib/models/Metadata.js').Metadata;

/**
 * @todo check if jasmine-node really acts weird 
 *        with objects with properties named 'undefined' 
 *        whose values are undefined
 */

describe('Metadata', function() {

  beforeEach(function() {
    //Cache.select(TEST_REDIS_DB);
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
              colors = meta.get_PlayerColorsByIndex(),
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
            
            expect(typeof colors).toEqual('object');
            expect(typeof colors[0]).toEqual('string');
            expect(colors[0]).toEqual('383838');

            //console.log(colors);
            //console.log(meta.getProperties());

            asyncSpecDone();
          });
      });
     
    asyncSpecWait();
        
  });
  
  
  it('should return map names in an array', function() {
    var
      i, // for iteration
      names = [],
      dfd = $.Deferred(),
      mac = MockApiClient(),
      meta = Metadata();
      
    mac.get('game/metadata',
      mac.mock_args,
      function(err, data) {
        meta = Metadata(data);  
        dfd.resolve();
      }
    );
      
    $.when(dfd)
      .done(function() {
        
        names = meta.prototype.getAllMapNames.call(meta);
        
        expect(names.length).toBeGreaterThan(0);

        for (i=0; i<names.length; i++) {
          expect(typeof names[i]).toEqual('string');
        }

        asyncSpecDone();
      });

    asyncSpecWait();
  });
  
  it('should return playlist names in an array', function() {
    var
      i, // for iteration
      names = [],
      dfd = $.Deferred(),
      mac = MockApiClient(),
      meta = Metadata();
      
    mac.get('game/metadata',
      mac.mock_args,
      function(err, data) {
        meta = Metadata(data);  
        dfd.resolve();
      }
    );
      
    $.when(dfd)
      .done(function() {
        
        names = meta.prototype.getAllPlaylistNames.call(meta);
        
        expect(names.length).toBeGreaterThan(0);
        
        for (i=0; i<names.length; i++) {
          expect(typeof names[i]).toEqual('string');
        }
        
        asyncSpecDone();
      });

    asyncSpecWait();
  });
  
 
});
  
