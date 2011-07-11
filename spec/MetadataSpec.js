var
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,
  Metadata = require('../lib/Metadata.js').Metadata;

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
});
  
