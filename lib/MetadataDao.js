
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Cache = require('../lib/Cache.js').Cache,
  Metadata = require('../lib/Metadata.js').Metadata;

/**
 * @param {ApiClient|MockApiClient} ApiClient
 */
function MetadataDao(ApiClient) {
  var 
    client = ApiClient(),
    meta,
    instance = {};

  /**
   * @returns {Deferred} representing completion of get
   */
  function get(assign_callback) {
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
          }); // tbd: fail
      })
      .fail(function() {
        client.get('game/metadata',
          {},
          function(err, data) {
            if (typeof err !== 'undefined' && err !== null) {
              // todo: fail the deferred?
              console.log(err);
            }
            meta = Metadata(data);
            meta.store();
            assign_callback(err, meta);
            dfd.resolve();
          }        
        );
      });
    
    return dfd;
  }
  
  /**
   * @returns {Deferred} representing success/failure of existence check
   */
   function exists() {
    var
      meta = Metadata(),
      dfd = $.Deferred();
      
    Cache.prototype.exists(meta.getKey(), function(err, obj) {
      if (typeof obj !== 'undefined') {
        if (obj === 0) {
          if (typeof err !== 'unefined' && err !== null) {
            //console.log(err);
          }
          //console.log(meta.getKey());
          dfd.reject();
        }
        else {
          dfd.resolve();
        }
      }
    });
      
    return dfd;
  }
    
  instance.exists = exists;
  instance.get = get;
    
  return instance;
}

exports.MetadataDao = MetadataDao;