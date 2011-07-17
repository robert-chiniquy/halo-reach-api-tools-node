
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Cache = require('../lib/Cache.js').Cache,
  Metadata = require('../lib/Metadata.js').Metadata;


(function() { // close over every mdd so you can memoize metadata
  // this introduces certain problems with testability
  var
    metadata = undefined;
    
  /**
   * @param {ApiClient|MockApiClient} ApiClient
   */
  function MetadataDao(ApiClient) {
    var 
      client = ApiClient(),
      instance = {};

    /**
     * @returns {Deferred} representing completion of get
     */
    function get(assign_callback) {
      var
        dfd = $.Deferred();

      if (typeof metadata !== 'undefined') {
        // just because we have a copy doesn't guarantee it's in cache
        metadata.store();
        assign_callback({}, metadata);
        dfd.resolve();
      }
      else {
        // if it's in cache, get it from there
        // if not, hit the api, and write it to cache
        $.when(instance.exists())
          .done(function() {
            //console.log('hitting cache');
            metadata = Metadata();
            $.when(metadata.fetch())
              .done(function() {
                //console.log(metadata.getProperties());
                assign_callback({}, metadata);
                dfd.resolve();
              }); // tbd: fail
          })
          .fail(function() {
            //console.log('hitting api');
            client.get('game/metadata',
              {},
              function(err, data) {
                if (typeof err !== 'undefined' && err !== null) {
                  // todo: fail the deferred?
                  console.log(err);
                }
                if (typeof data === 'undefined') {
                  console.log('client.get game/metadata returned undefined!');
                }
                metadata = Metadata(data);
                metadata.store();
                assign_callback(err, metadata);
                dfd.resolve();
              }        
            );
          });
      }
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
              console.log(err);
            }
            //console.log('Failed existence on '+ meta.getKey());
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

  function clearMemoizedMetadata() {
    metadata = undefined;
  }

  exports.MetadataDao = MetadataDao;
  exports.clearMemoizedMetadata = clearMemoizedMetadata;
  
})();
