
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;
  
  
describe('CacheableEntity', function() {

  var
    mc, mc2;
  
  function MockCacheableEntity(props) {
    var
      inst = {},
      setters = {
        'a': function(value) {
          props.a = +value;
        }
      };
    
    inst.id = '1';
    inst.type = 'MockCacheableEntity';
    
    inst.getProperties = function() {
      return props;
    }
    
    return CacheableEntity(inst, props, setters, props);
  }
  
  beforeEach(function() {
    mc = new MockCacheableEntity( 
      {
        'a': 1,
        'b': 3      
      });
      
    mc2 = new MockCacheableEntity(
      {
        'a': 99,  
        'b': 'string'
      });
      
    mc2.id = 2;
      
  });
  
  it('should be able to enter and return from cache', function() {
    
    mc.store();

    mc = new MockCacheableEntity({'a':2});
    
    $.when(mc.fetch())
      .done(function() {
        expect(mc.get_a()).toEqual(1);
        asyncSpecDone();
      });

    asyncSpecWait();
    
  });
  
  it("shouldn't allow collisions with different ids", function() {
    mc.store();
    mc2.store();
    
    $.when(mc.fetch(), mc2.fetch())
      .done(function() {
        expect(mc.get_a()).toNotEqual(mc2.get_a());
        asyncSpecDone();
      });

    asyncSpecWait();
  });
  
  it('should correctly apply instance ttls and catch a cache miss', function() {
    
    var
      dfd = $.Deferred();
    
    mc.ttl = 1; // 1 second
    mc.store();
    
    $.when(dfd)
      .done(function() {
        $.when(mc.fetch())
          .done(function() {
            expect(typeof mc.cache_miss).toNotEqual('undefined');
            expect(mc.cache_miss).toEqual(true);
            asyncSpecDone();        
          })
      });
    
    setTimeout(
      function() {
        dfd.resolve();
      }, 2000);

    asyncSpecWait();
  });
  
});