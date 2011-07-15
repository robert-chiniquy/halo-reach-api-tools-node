var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  Cache = require('../lib/Cache.js').Cache,  
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,  
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,  
  PlayerDao = require('../lib/PlayerDao.js').PlayerDao;


describe('PlayerDao', function() {
    
  beforeEach(function() {
    Cache.prototype.select(TEST_REDIS_DB);    
    Cache.prototype.flushdb();
  });

  it('should detect non-existence', function() {
    var
      existed,
      pd = PlayerDao(MockApiClient);
            
    $.when(pd.exists('cioj'))
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
      pd = PlayerDao(MockApiClient),
      player; 
            
    pd.get(function(err, obj) {
      player = obj;
      
      $.when(pd.exists())
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