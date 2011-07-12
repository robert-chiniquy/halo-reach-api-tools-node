
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  ApiClient = require('../lib/ApiClient.js').ApiClient,
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,  
  Cache = require('../lib/Cache.js').Cache,
  Metadata = require('../lib/Metadata.js').Metadata;


function MetadataDao(mock) {
  var 
    client = typeof mock !== 'undefined' && mock === true 
                ? MockApiClient()
                : ApiClient(),
    meta,
    instance = {};
    
  instance.id = 0;

  /**
   * @returns {Deferred} representing completion of get
   */
  instance.get = function(assign_callback) {
    var
      dfd = $.Deferred();
    
    // if it's in cache, get it from there
    // if not, hit the api, and write it to cache
    $.when(instance.exists())
      .done(function() {
        meta = Metadata();
        $.when(meta.fetch())
          .done(function() {
            assign_callback({}, meta);
            dfd.resolve();
          });
      })
      .fail(function() {
        client.get('game/metadata',
          {},
          function(err, data) {
            meta = Metadata(data);
            meta.store();
            assign_callback({}, meta);
            dfd.resolve();
          }        
        );
      });
    
    return dfd;
  };  
  
  /**
   * @returns {Deferred} representing success/failure of existence check
   */
  instance.exists = function() {
    var
      meta = Metadata(),
      dfd = $.Deferred();
      
    Cache.prototype.exists(meta.getKey(), function(err, obj) {
      if (typeof obj !== 'undefined') {
        if (obj === 0) {
          dfd.reject();
        }
        else {
          dfd.resolve();
        }
      }
    });
      
    return dfd;
  };
    
  return instance;
}

exports.MetadataDao = MetadataDao;