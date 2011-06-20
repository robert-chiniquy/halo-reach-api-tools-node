
var
  CacheableModule = require('../lib/Cacheable.js'),
  Cacheable = CacheableModule.Cacheable,
  redis_client = CacheableModule.redis_client;
  
describe('Caching', function() {
  
  
  it('should connect!', function() {
    expect(redis_client.connected).toEqual(true);
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
      
    mc.store();

    mc.properties = {
      'a': 2
    };
    
    mc = mc.fetch();
    
    expect(mc.properties.a).toEqual(1);

    
  });
  
});