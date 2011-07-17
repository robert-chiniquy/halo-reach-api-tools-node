
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Cache = require('../lib/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,  
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,  
  MetadataDao = require('../lib/MetadataDao.js').MetadataDao;


describe('MetadataDao', function() {
  
  beforeEach(function() {
    Cache.prototype.select(TEST_REDIS_DB);    
    Cache.prototype.flushdb();
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
