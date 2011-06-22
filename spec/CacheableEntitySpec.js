
var
  $ = require('../node_modules/jquery/dist/node-jquery.js'),
  CacheableEntity = require('../lib/CacheableEntity.js').CacheableEntity;
  
  
describe('CacheableEntity', function() {

  var
    mc;
  
  function MockCacheableEntity(props) {
    var
      inst = {};
    
    inst.id = '1';
    inst.type = 'MockCacheableEntity';
    inst.properties = props;
    
    inst.getProperties = function() {
      return inst.properties;
    }
    
    return CacheableEntity(inst, props, {}, props);
  }
  
  beforeEach(function() {
    mc = new MockCacheableEntity( 
      {
        'a': 1,
        'b': 3      
      });
  });
  
  it('should be able to enter and return from cache', function(){
    
    console.log(mc);
    
    mc.store();
    
    mc.properties = {
      'a': 2
    };
    
    $.when(mc.fetch())
      .done(function() {
        expect(mc.properties.a).toEqual(1);
        asyncSpecDone();
      });

    asyncSpecWait();  
  });
  
});