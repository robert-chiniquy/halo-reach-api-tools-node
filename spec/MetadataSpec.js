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
              weapons = meta.get_AllWeaponsById();
              
            expect(typeof meta.get_CurrentArenaSeason()).toEqual('number');
            expect(typeof meta.get_AllReachPlaylists()).toEqual('object');
            
            //expect(meta.get_AllReachPlaylists()[0]).toEqual(false);
            
            expect(typeof meta.get_GlobalRanks()).toEqual('object');
            expect(meta.get_GlobalRanks()[0].DisplayName).toEqual('Recruit');
            
            expect(typeof weapons).toEqual('object');            
            expect(typeof weapons[0]).toEqual('object');
            expect(weapons[0].Name).toEqual('Unknown Event');

//            console.log(meta.get_AllReachPlaylists());
            //console.log(meta.getProperties());

            asyncSpecDone();
          });
      });
     
    asyncSpecWait();
        
  });
  
 
});
  
