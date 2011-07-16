
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient;

describe('MockApiClient', function() {
  it('should correctly mock paths', function() {
    var
      mac = MockApiClient();
      
    expect(mac.get_url('player/gamehistory', mac.mock_args))
      .toEqual('spec/mock_api_responses/player_gamehistory_' + mac.FAKE_KEY + '_cioj_Unknown_0.json');
  });
  
  /* uncomment this test only to build mocks
  it('should be able to build mocks', function() {
    var
      mac = MockApiClient();
      
    $.when.apply($, mac.build_mocks())
      .done(function(){
        asyncSpecDone();
      });
    
    asyncSpecWait();
    
  });
  */
 
});