
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;
  
  
describe('CacheableEntity', function() {

  var
    mc;
  
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
  
});