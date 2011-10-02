
var
  $ = require('jquery/dist/node-jquery.js'),
  TEST_REDIS_DB = require('../lib/config.js').TEST_REDIS_DB,  
  Cache = require('../lib/services/Cache.js').Cache,
  CacheableEntity = require('../lib/types/CacheableEntity.js').CacheableEntity;  
  
  
describe('CacheableEntity', function() {

  var
    mc, mc2, mc3;
  
  beforeEach(function() {
    Cache.select(TEST_REDIS_DB);
    Cache.flushdb();
  });
  
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
        },
        'arr': function(value) {
          props.arr = value;
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
        'complex': {'3':'salsa'},
        'arr': ['pirate', 'parrot']
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

    mc.set_b(444);
    
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
    
    mc3.set_b('1313');
    mc3.set_complex({});
    mc3.set_arr([]);
    
    $.when(mc3.fetch())
      .done(function() {
        var
          arr = mc3.get_arr(),
          complex = mc3.get_complex();
          
        expect(mc3.get_b()).toEqual(444);
        expect(typeof complex[3]).toEqual('string');
        expect(complex[3]).toEqual('salsa');
        expect(typeof arr[0]).toEqual('string');
        expect(typeof arr[1]).toEqual('string');
        
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