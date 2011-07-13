
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;  
  
  
describe('CacheableEntity', function() {

  var
    mc, mc2, mc3;
  
  function MockCacheableEntity(props) {
    var
      inst = {},
      setters = {
        'a': function(value) {
          props.a = +value;
          inst.id = props.a;
        },
        'b': function(value) {
          props.b = +value;
        },
        'complex': function(value) {
          props.complex = value;
        }
      };
    
    inst.type = 'MockCacheableEntity';

    inst.getProperties = function() {
      return props;
    }

    return CacheableEntity(inst, props, setters, props);
  }
  
  beforeEach(function() {
    
    mc3 = new MockCacheableEntity(
      {
        'a': 333,
        'b': 444,
        'complex': {'3':'salsa'}
      }
    );

    mc = new MockCacheableEntity( 
      {
        'a': 1,
        'b': 3      
      });
      
    mc2 = new MockCacheableEntity(
      {
        'a': 2,  
        'b': '9'
      });    
    
  });
  
  
  it('should be able to enter and return from cache', function() {
    
    mc.store();

    mc = new MockCacheableEntity({'a':1, 'b':4});
    
    $.when(mc.fetch())
      .done(function() {
        expect(mc.get_b()).toEqual(3);
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
  
  
  it('should handle complex properties', function() {
    
    mc3.store();
    
    mc3 = new MockCacheableEntity({'a':333, 'b':4});
    
    $.when(mc3.fetch())
      .done(function() {
        var
          complex = mc3.get_complex();
          
        expect(mc3.get_b()).toEqual(444);
        expect(typeof complex[3]).toEqual('string');
        
        asyncSpecDone();
      });
    
    asyncSpecWait();
  });
  
  
  
  it('should correctly apply instance ttls', function() {
    
    var
      dfd = $.Deferred();
    
    mc.ttl = 1000;
    mc.store();
    
    mc.getTtl(function(err, obj) {
      expect(+obj).toBeGreaterThan(0);
      asyncSpecDone();
    });
    
    /*
    $.when(dfd)
      .done(function() {
        $.when(mc.fetch())
          .done(function() {
            expect(typeof mc.cache_miss).toNotEqual('undefined');
            expect(mc.cache_miss).toEqual(true); // tbd: real errors
            asyncSpecDone();        
          })
      });
    
    setTimeout(
      function() {
        dfd.resolve();
      }, 2000);
    */
    
    asyncSpecWait();
  });
  
});