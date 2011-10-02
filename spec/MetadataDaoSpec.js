
var
  $ = require('jquery/dist/node-jquery.js'),
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,  
  Cache = require('../lib/services/Cache.js').Cache,  
  MockApiClient = require('../lib/services/MockApiClient.js').MockApiClient,  
  MetadataDao = require('../lib/daos/MetadataDao.js').MetadataDao;


describe('MetadataDao', function() {
  
  beforeEach(function() {
    Cache.select(TEST_REDIS_DB);    
    Cache.flushdb();
  });
  
  it('should detect non-existence', function() {
    var
      existed,
      mdd = MetadataDao(MockApiClient);
            
    $.when(mdd.exists())
      .fail(function(){
        existed = false;
        asyncSpecDone();
        expect(existed).toEqual(false); 
      })
      .done(function(){
        existed = true;
        asyncSpecDone();
        expect(existed).toEqual(false); 
      });
      
    asyncSpecWait();
  });
  
  it('should detect existence', function() {
    var
      existed,
      mdd = MetadataDao(MockApiClient),
      meta; 
            
    mdd.get(function(err, obj) {
      meta = obj;
      
      //console.log(meta.getKey());
      
      $.when(mdd.exists())
        .fail(function(){
          existed = false;
          asyncSpecDone();
          expect(existed).toEqual(true); 
        })
        .done(function(){
          existed = true;
          asyncSpecDone();
          expect(existed).toEqual(true); 
        });      
    });      
      
    asyncSpecWait();    
  });
   
});
