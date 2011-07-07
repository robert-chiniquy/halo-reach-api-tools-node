
var
  ApiClient = require('../lib/ApiClient.js').ApiClient;
  
describe('ApiClient', function() {
  it('should generate urls correctly for each action', function() {
    var
      api = ApiClient(),
      action = 'player/gamehistory',
      args = {
        'identifier': 1,
        'gamertag': 'h'
      },
      url = api.get_url(action, args);
      
    expect(api.get_params(args).gamertag).toEqual('h');
    expect(url).toEqual('api/reach/reachapijson.svc/player/gamehistory/1/h/Unknown/0');
      
    
  });
});