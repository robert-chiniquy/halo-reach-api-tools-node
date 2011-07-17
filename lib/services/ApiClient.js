
var
  http = require('http'),
  $ = require('jquery/dist/node-jquery.js'),
  API_HOST = 'www.bungie.net',
  API_ROOT = '/api/reach/reachapijson.svc',
  API_KEY = require('../../lib/config.js').API_KEY;


function ApiClient() {
  var
    instance = {},
    global_defaults = {
      'identifier': API_KEY,
      'iPage': 0,
      'variant_class': 'Unknown'
    };
    
  instance.actions = { // action -> default params
    'player/gamehistory': 
      {
        'params': '{identifier}/{gamertag}/{variant_class}/{iPage}',
        'return': 'RecentGames'
      },
    'player/details/byplaylist':
      {
        'params': '{identifier}/{gamertag}',
        'return': 'StatisticsByPlaylist'
      },
    'player/details/bymap':
      {
        'params': '{identifier}/{gamertag}',
        'return': 'StatisticsByMap'//'AiStatistics'
      },        
    'player/details/nostats':
      {
        'params': '{identifier}/{gamertag}',
        'return': 'Player'
      },
    'game/details':
      {
        'params': '{identifier}/{gameId}',
        'return': 'GameDetails'
      },
    'game/metadata': 
      {
        'params': '{identifier}',
        'return': 'Data'
      }
  };


  /**
   * @param {string} action
   * @param {object} args
   * @param {function} assign_callback(err, obj)
   */
  instance.get = function(action, args, assign_callback) {
    var
      request,
      data = '',
      client = http.createClient(80, API_HOST),
      url = instance.get_url(action, args);
      
    request = client.request('GET', url, {'host': API_HOST});

    request.on('response', function(response) {
      response.on('data', function(chunk) {
        data = data + chunk;
      });
      response.on('end', function() {
        var
          a; // for iteration
        
        // select the return node
        data = data[instance.actions[action]['return']];
        
        // add any arguments which aren't present?
        /*
        for (a in args) {
          if (({}).hasOwnProperty.call(args, a)) {
            if (!({}).hasOwnProperty.call(data, a)) {
              data[a] = args[a];
            }
          }
        }
        */
        assign_callback({}, data);
      });
    });
    
    request.end();
  };
  
  instance.get_params = function(args) {
    return $.extend(global_defaults, args);    
  };

  instance.get_url = function(action, args) {
    var
      opts = instance.get_params(args),
      url = API_ROOT + '/' + action + '/' + instance.actions[action].params;

    return url.replace(/\{(\w+)\}/g, function(str, match) {
      return match in (opts || {}) ? opts[match] : str;
    });
  };

  instance.prototype = ApiClient.prototype;  
  return instance;
}

exports.ApiClient = ApiClient;