

var
  fs = require('fs'),
  API_KEY = require('../lib/config.js').API_KEY,
  ApiClient = require('../lib/ApiClient.js').ApiClient;

function MockApiClient() {
  var
    instance = {},
    api_mixin = ApiClient(),
    MOCK_DIR = 'mock_api_responses';
    
  instance.get_url = function(action, args) {
    var
      opts = api_mixin.get_params(args),
      url = API_ROOT + '/' + action + '/' + api_mixin.actions[action].params;
      
    url = url.replace(/\//g, '_');
    
    return url.replace(/\{(\w+)\}/g, function(str, match) {
      return match in (opts || {}) ? opts[match] : str;
    });    
  };

  instance.get = function(action, args, assign_callback) {
    
  };
  
  instance.build_mocks = function() {
    var
      action; // for iteration
      
    for (action in api_mixin.actions) {
      api_mixin.get(action, 
        {
          'gamertag': 'cioj',
          'gameId': '689591721'
        },
        function(err, obj) {
          
          console.log(err);
          console.log(obj);
        }        
      );
    }
  };

  instance.prototype = MockApiClient.prototype;
  return instance;
}

exports.MockApiClient = MockApiClient;