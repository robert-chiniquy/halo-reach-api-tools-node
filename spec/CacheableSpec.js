
var
  CM = require('../lib/Cacheable.js'),
  redis = CM.redis,
  redis_client = CM.redis_client,
  Cacheable = CM.Cacheable,
  Cache = CM.Cache;
  
  
describe('Caching', function() {


  it('should connect!', function() {
    redis_client = redis.createClient();

    redis_client.on("connect", function () {
      expect(redis_client.connected).toEqual(true);
    });
  });
  
  function MockCacheable() {
    this.id = '1';
    this.type = 'MockCacheable';
    this.properties = {
      'a': 1,
      'b': 3      
    }
    
    this.getProperties = function() {
      return this.properties;
    }
    
    Cacheable(this);
  }
  
  it('should be able to set and retrieve stuff from cache', function(){
    
    var
      mc = new MockCacheable();
      
    redis_client = redis.createClient();
      
    mc.store();

    mc.properties = {
      'a': 2
    };
    
    mc = mc.fetch();

    expect(typeof mc.properties).toNotEqual('undefined');
  
  });
  
});