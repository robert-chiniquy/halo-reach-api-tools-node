
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  MockApiClient = require('../spec/MockApiClient.js').MockApiClient,  
  MetadataDao = require('../lib/MetadataDao.js').MetadataDao;

/*
describe('MetadataDao', function() {
  it('should detect non-existence', function() {
    var
      existed,
      mdd = MetadataDao(true);
      
    mdd.id = mdd.id + 100; // non-existent id
//    console.log(mdd.id);
      
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
      mac = MockApiClient(),
      mdd = MetadataDao(true),
      meta; 
            
    mdd.get(function(err, obj) {
      meta = obj;
    });
      
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
      })
      
    asyncSpecWait();    
  });
  
  
});
*/