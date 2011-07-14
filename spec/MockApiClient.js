
var
  fs = require('fs'),
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  API_KEY = require('../lib/config.js').API_KEY,
  ApiClient = require('../lib/ApiClient.js').ApiClient;


function MockApiClient() {
  var
    instance = {},
    api_mixin = ApiClient(),
    MOCK_DIR = 'spec/mock_api_responses';
    
  // default args for mock
  instance.mock_args =
    {
      'gamertag': 'cioj',
      'gameId': 689591721
    };
    
  // replaces the api key in mock
  instance.FAKE_KEY = '@@@@@';
    
  /**
   * @param {string} action index into the api client actions
   * @param {object} args parameters for the api call
   * @returns {string} url relative filesystem path to mock json
   */  
  instance.get_url = function(action, args) {
    var
      mock_args = $.extend(instance.mock_args, args),
      opts = api_mixin.get_params(mock_args),
      url = action + '/' + api_mixin.actions[action].params;
      
    url = url.replace(/\//g, '_');
    url = MOCK_DIR + '/' + url;
    
    opts.identifier = instance.FAKE_KEY;
    
    return url.replace(/\{(\w+)\}/g, function(str, match) {
      return match in (opts || {}) ? opts[match] : str;
    });    
  };

  /**
   * @param {string} action index into the api client actions
   * @param {object} args parameters for the api call
   * @param {function} assign_callback(err, obj)
   */
  instance.get = function(action, args, assign_callback) {
    var
      filename = instance.get_url(action, args);
      
    fs.readFile(filename, 'utf8', function(err, data) {
      data = JSON.parse(data);
      data = data[api_mixin.actions[action]['return']];
      assign_callback(err, data);
    });    
  };
  
  /**
   * Hits every api call with default args, saves json to file
   * @returns {Array} array of deferreds representing each mock build
   */
  instance.build_mocks = function() {
    var
      dfds = [],
      action; // for iteration
      
    for (action in api_mixin.actions) {
      if (({}).hasOwnProperty.call(api_mixin.actions, action)) {
        (function(action, args){
          var
            dfd = $.Deferred();
            
          dfds.push(dfd);
          api_mixin.get(action, args,
            function(err, obj) {
              fs.writeFile(instance.get_url(action, args), obj);
              dfd.resolve();
            }        
          );
        })(action, instance.mock_args);          
      }
    }
    
    return dfds;
  };

  instance.prototype = MockApiClient.prototype;
  return instance;
}

exports.MockApiClient = MockApiClient;